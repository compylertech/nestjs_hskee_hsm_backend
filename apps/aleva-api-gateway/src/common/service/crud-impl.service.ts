import { ClientProxy } from "@nestjs/microservices";
import { PageOptionsDto } from "apps/common/dto/page-optional.dto";
import { isArray } from "class-validator";

type ConsolidatedEntity<TDto, TEntityDto> = {
    created?: TDto;
    linked?: TEntityDto;
};

type LinkedEntity = {
    created_at?: string; // or Date
    updated_at?: string; // or Date
    [key: string]: any; // other properties
};

export class CrudService<
    TDtoTypeEnum,
    TApiCreateDto,
    TApiUpdateDto,
    TDto extends object,
    TCreateDto,
    TUpdateDto,
    TEntityDto,
    TEntityCreateDto
> {
    // dtoIdKey: string;
    mapKeys: string[];

    constructor(
        private readonly dtoIdKey: string,
        protected readonly client: ClientProxy,
        public readonly patterns: any,
        private readonly dtoClass: { new(): TEntityCreateDto; keys(): string[] },
        private readonly mappings: Array<{
            service: CrudService<TDtoTypeEnum, TApiCreateDto, TApiUpdateDto, TDto, TCreateDto, TUpdateDto, TEntityDto, TEntityCreateDto> | any;
            entityType: TDtoTypeEnum;
            mapKey: keyof TDto;
        }>
    ) {
        this.mapKeys = this.mappings.map(({ mapKey }) => mapKey as string);
    }

    /**
     * creates an entity and processes related fields.
     */
    async createEntityAndRelatedFields(createDto: TApiCreateDto): Promise<TDto> {
        // exclude each key that is a mapKey in mapping
        const createContractDto = Object.entries(createDto).reduce((acc, [key, value]) => {
            if (!this.mapKeys.includes(key)) {
                acc[key] = value;
            }
            return acc;
        }, {} as TCreateDto);

        // create parent entity
        const parentResponse = await this.client
            .send<TDto, TCreateDto>(this.patterns.CREATE, createContractDto)
            .toPromise();

        // create children entity by calling `createEntityFields`
        return {
            ...parentResponse,
            ...(await this.createEntityFields(parentResponse[this.dtoIdKey], createDto))
        };
    }

    /**
     * fetches all entities with pagination.
     */
    async findAllEntities(pageOptionsDto: PageOptionsDto): Promise<TDto[]> {
        const parentResponse = await this.client.send<TDto[]>(this.patterns.FIND_ALL, pageOptionsDto).toPromise();
       
        const mappedData = await this.fetchAndMap(parentResponse["data"], this.dtoIdKey);
        
        return { ...parentResponse, ...mappedData };
    }

    /**
     * fetches single entity.
     */
    async findOneEntity(id : string, pageOptionsDto: PageOptionsDto = null): Promise<TDto> {
        const parentResponse = await this.client
            .send<TDto>(this.patterns.FIND_ONE, id)
            .toPromise();

        const mappedData = await this.fetchAndMap([parentResponse], this.dtoIdKey);

        return { ...mappedData[0] };
    }

    /**
     * updates an entity and its related fields.
     */
    async updateEntityAndRelatedFields(
        id: string,
        updateDto: TApiUpdateDto
    ): Promise<TDto> {
        // exclude each key that is a mapKey in mapping
        const updateDtoContract = Object.entries(updateDto).reduce((acc, [key, value]) => {
            if (!this.mapKeys.includes(key)) {
                acc[key] = value;
            }
            return acc;
        }, {} as TUpdateDto);

        // update parent entity
        const updatedEntity = await this.client
            .send<TDto>(this.patterns.UPDATE, { [this.dtoIdKey]: id, ...updateDtoContract })
            .toPromise();

        // create children entity by calling `updateEntityFields`
        return {
            ...updatedEntity,
            ...(await this.updateEntityFields(id, updateDto, updateDtoContract)),
        };
    }

    // remove and process linked mappings
    // including intermediary table mappings.
    async removeEntityFields(entityId: string): Promise<void> {
        // dynamically remove all linked entities for all combinations of entity types and map keys
        await Promise.all(
            await this.mappings.flatMap(async ({ service, entityType, mapKey }) => {

                // generate all possible combinations of mapKeys and remove links
                await this.mappings.flatMap(async ({ [mapKey]: otherMapKey }) => {
                 
                        // remove prefixed entity type for the current mapKey
                        await service.removeEntityLinks(entityId, `entity_${otherMapKey as string}` as TDtoTypeEnum);

                        // remove base entity type for the current mapKey
                        await service.removeEntityLinks(entityId, entityType);
                });
            })
        );
        await this.client.send<void>(this.patterns.DELETE, entityId).toPromise();
    }

    /**
     * Recursively fetches and maps data into the existing entities array.
     * @param entities The initial entities to update.
     * @param identifierKey The key used to identify entities.
     * @param entityChildAuxKey Auxiliary key for nested relationships.
     */
    private async fetchAndMap(
        entities: any[],
        identifierKey: string,
        entityChildAuxKey: TDtoTypeEnum | null = null
    ): Promise<TDto[]> {
        for (const { service, entityType, mapKey } of this.mappings) {
            
            // return if the id contains the mapKey
            if (identifierKey.includes(mapKey as string) || !Array.isArray(entities) || entities.length === 0 
            || entities.every((item) => item == null) || identifierKey.includes(mapKey as string)) {
                continue
            }

            // extract the entity IDs from the entities array
            const entityIDs = entities.map((entity) => entity[identifierKey]);

            // fetch related data
            const fetchedData = await service.fetchByEntityIDs(entityIDs, entityChildAuxKey || entityType);

            if (fetchedData) {
                
                // map the fetched data back to the entities
                for (const entity of entities) {
                    const relatedData = fetchedData[entity[identifierKey]] || fetchedData["data"] || [];
                    const childAuxKey = `entity_${mapKey as string}` as TDtoTypeEnum;
                    const childIdentifierKey = `${childAuxKey}_id`;

                    // TODO: Add support for alternative key mappings
                    const toMapKey = mapKey == "answers" ? "questionnaires" : mapKey;

                    const transformedData = relatedData.map(item => {
                        const result = {};
                    
                        // conditionally add `childIdentifierKey`
                        if (item && item[childIdentifierKey] !== undefined && item[childIdentifierKey] !== null) {
                            result[childIdentifierKey] = item[childIdentifierKey];
                        }
                    
                        // conditionally add `entity_type`
                        if (item && item.entity_type !== undefined && item.entity_type !== null) {
                            result["entity_type"] = item.entity_type;
                        }
                    
                        // conditionally add `entity_id`
                        if (item && item.entity_id !== undefined && item.entity_id !== null) {
                            result["entity_id"] = item.entity_id;
                        }
                    
                        // add the contents of `toMapKey` if it exists
                        if (item && item[toMapKey]) {
                            Object.assign(result, item[toMapKey]);
                        }
                        
                        return !isNaN(Number(Object.keys(result)[0])) ? Object.values(result) : result;
                    });

                    entity[mapKey] = isArray(transformedData) ? transformedData[0] : transformedData;


                    // recursively fetch and map child relationships if needed
                    if (relatedData.length > 0) {
                        await this.fetchAndMap(transformedData, childIdentifierKey, childAuxKey)
                    }
                }
            }

        }

        return entities;
    }

     // get entity keys for mapping related fields in parent object
     private getDtoKeys(): string[] {
        return this.dtoClass.keys();
    }

    // entity mapping
    private async mapEntityFields<TDto, TEntityDto>(
        responses: TDto[],
        entityId: string,
        entityType: TDtoTypeEnum
    ): Promise<TEntityDto[]> {
        const entityDtoFields = this.getDtoKeys();

        return responses.map((response) => {
            const mappedFields = Object.keys(response)
                .filter((key) => entityDtoFields.includes(key))
                .reduce((acc, key) => {
                    (acc as any)[key] = (response as any)[key];
                    return acc;
                }, {} as Partial<TEntityDto>);

            const link = {
                entity_id: entityId,
                entity_type: entityType,
                ...mappedFields,
            } as TEntityDto;

            return link;
        });
    }

    // create and process linked mappings
    // including intermediary table mappings.
    // E.g. property -> media via entity_media
    private async createEntityFields<TDto>(
        entityId: string,
        parentResponse: TDto,
        entityAuxType: any = null
    ): Promise<Record<string, any[]>> {
        const fieldResponses = await Promise.all(
            this.mappings.map(async ({ mapKey, service, entityType }) => {
                const relatedData = (parentResponse as any)[mapKey] || [];

                if (!relatedData.length) return { [mapKey]: [] };
                
                // create and link the nested entities
                const createdEntities = await service.createAndLinkEntities(entityId, entityAuxType || entityType, relatedData);

                // process nested entities by using the linked parent IDs
                const nestedFields = await Promise.all(
                    createdEntities.map(async (linked, index) => {
                        const linkedEntityIdKey = Object.keys(linked).find(
                            (key) => /^entity_.*_id$/.test(key)
                        ) || linked[`entity_${mapKey as string}_id`];
                        
                        // ID of the linked entity
                        const linkedEntityId = linked[linkedEntityIdKey];
                        const childFields = await service.createEntityFields(linkedEntityId, relatedData[index], `entity_${mapKey as string}`);
                        return { ...relatedData[index], ...linked, ...childFields };
                    })
                );

                return { [mapKey]: nestedFields };
            })
        );

        // combine all field responses into a single object
        return fieldResponses.reduce((acc, response) => ({ ...acc, ...response }), {});
    }

    // links an object to the entity table.
    // For e.g. property -> media
    private async createAndLinkEntities(
        entityId: string,
        entityType: TDtoTypeEnum,
        entities: TCreateDto[]
    ): Promise<ConsolidatedEntity<TDto, TEntityDto>[]> {
        // create entities
        const createdEntities = await Promise.all(
            entities.map((entity) =>
                this.client.send<TDto, TCreateDto>(this.patterns.CREATE, entity).toPromise()
            )
        );

        // map fields for linking
        const links = await this.mapEntityFields<TDto, TEntityCreateDto>(
            createdEntities,
            entityId,
            entityType as TDtoTypeEnum
        );

        // link entities
        const linkedEntities = await Promise.all(
            links.map((link) =>
                this.client.send<TEntityDto, TEntityCreateDto>(this.patterns.LINK_ENTITY, link).toPromise()
            )
        );

        // merge linked data into created entities
        const consolidatedEntities: ConsolidatedEntity<TDto, TEntityDto>[] = createdEntities.map((created, index) => {
            const linked = linkedEntities[index] as LinkedEntity;
            const { created_at, updated_at, ...linkedWithoutTimestamps } = linked;

            return {
                ...created,
                ...linkedWithoutTimestamps
            };
        });

        return consolidatedEntities;
    }

    // fetch by ids the linked mappings based on the entity_type
    private async fetchByEntityIDs(entityIDs: string[], entityType: TDtoTypeEnum | undefined = null): Promise<Record<string, TDto[]>> {
        
        const response = await this.patterns.FIND_BY_ENTITIES ? await this.client
            .send<Record<string, TDto[]>>(this.patterns.FIND_BY_ENTITIES, {
                entity_ids: entityIDs,
                entity_type: entityType,
                pageOptionsDto: new PageOptionsDto()
            })
            .toPromise() : null;

        return response;
    }

    // update and process linked mappings
    // including intermediary table mappings.
    private async updateEntityFields(
        entityId: string,
        updateEntityDto: TApiUpdateDto,
        updateEntityDtoContract: TUpdateDto,
        entityAuxType: any = null
    ): Promise<TDto> {
        const updatedFieldResponses: Record<string, any[]> = {};

        // update parent details
        const entityResponse = await this.client
            .send<TDto, TUpdateDto>(
                this.patterns.UPDATE,
                { [this.dtoIdKey]: entityId, ...updateEntityDtoContract }
            )
            .toPromise();

        // process updates dynamically for all mappings
        await Promise.all(
            this.mappings.map(async ({ service, entityType, mapKey }) => {
                const mappingMappedKey = `${mapKey as string}`;
                const dataToUpdate = (updateEntityDto as any)[mapKey] || [];
                if (!dataToUpdate.length) {
                    updatedFieldResponses[mappingMappedKey] = [];
                    return;
                }

                // fetch existing entities and map linked entity IDs
                const existingEntities = (await service.fetchByEntityIDs([entityId], entityAuxType || entityType))[entityId] || [];
                const existingEntityIds = existingEntities.map((e) => e[service.dtoIdKey]);
                const linkedEntityIdMap = existingEntities.reduce(
                    (acc, linked) => {
                        const linkedEntityIdKey = Object.keys(linked).find((key) => /^entity_.*_id$/.test(key));

                        if (linkedEntityIdKey) {
                            acc[linked["entity_id"]] = acc[linked["entity_id"]] || [];
                            acc[linked["entity_id"]].push(linked[linkedEntityIdKey]);
                        }
                        return acc;
                    },
                    {} as Record<string, string[]>
                );

                // separate new entities and existing entities to update
                const newEntities = dataToUpdate.filter((entity) => !entity[service.dtoIdKey]);
                const entitiesToUpdate = dataToUpdate.filter(
                    (entity) => entity[service.dtoIdKey] && existingEntityIds.includes(entity[service.dtoIdKey])
                );

                // create and link new entities
                const newEntityResponses = await service.createAndLinkEntities(entityId, entityAuxType || entityType, newEntities);

                // update existing entities and handle nested fields
                const updatedEntityResponses = await Promise.all(
                    entitiesToUpdate.map(async (entity) => {
                        // get all linked entity IDs for the current entity
                        const linkedEntityIds = linkedEntityIdMap[entityId] || [];

                        // update each linked entity recursively
                        const nestedFieldResponses = await Promise.all(
                            linkedEntityIds.map((linkedEntityId) =>
                                service.updateEntityFields(
                                    linkedEntityId,
                                    entity,
                                    entity,
                                    `entity_${mappingMappedKey}`
                                )
                            )
                        );

                        // merge nested responses
                        return nestedFieldResponses.reduce((acc, nestedFieldResponse) => ({ ...acc, ...nestedFieldResponse }), entity);
                    })
                );

                // store responses for the current map key
                updatedFieldResponses[`${mappingMappedKey}`] = [...newEntityResponses, ...updatedEntityResponses];
            })
        );

        // merge updated field responses with the parent entity response
        return updatedFieldResponses as TDto;
    }

    // remove entity linked mappings
    private async removeEntityLinks(entityId: string, entityType: TDtoTypeEnum): Promise<void> {

        await this.client
            .send<void>(this.patterns.DELETE_BY_ENTITY, { entity_id: entityId, entity_type: entityType })
            .toPromise();

    }
 
}