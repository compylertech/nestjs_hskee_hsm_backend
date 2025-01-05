import { ClientProxy } from '@nestjs/microservices';

// meta
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

type LinkedEntity = {
    created_at?: string; // or Date
    updated_at?: string; // or Date
    [key: string]: any; // other properties
};

type ConsolidatedEntity<TDto, TEntityDto> = {
    created?: TDto;
    linked?: TEntityDto;
  };
export abstract class BaseService<
    TDtoTypeEnum,
    TApiCreateDto extends TCreateDto,
    TApiUpdateDto extends TUpdateDto,
    TDto extends object,
    TCreateDto, TUpdateDto,
    TEntityDto, TEntityCreateDto
> {
    constructor(
        private readonly tDtoID: string,
        protected readonly client: ClientProxy,
        private readonly patterns: any,
        private readonly dtoClass: { new(): TEntityCreateDto; keys(): string[] },
        private readonly mappings: Array<{
            service: BaseService<any, any, any, any, any, any, any, any>;
            entityType: TDtoTypeEnum;
            mapKey: keyof TDto;
        }>
    ) { }

    private getDtoKeys(): string[] {
        return this.dtoClass.keys();
    }

    /**
     * Recursively fetches and maps data into the existing entities array.
     * @param entities The initial entities to update.
     * @param identifierKey The key used to identify entities.
     * @param entityChildAuxKey Auxiliary key for nested relationships.
     */
    async fetchAndMap(
        entities: any[],
        identifierKey: string,
        entityChildAuxKey: string | null = null
    ): Promise<any> {
        for (const mapItem of this.mappings) {
            const { service, entityType, mapKey } = mapItem;
            const entityServiceType = entityType;
            console.log(`mapKey: ${mapKey as string}`)
            console.log(`entityType: ${entityType}`)
            console.log(`identifierKey: ${identifierKey}`)
            console.log(`entityChildAuxKey: ${entityChildAuxKey}`)

            // extract the entity IDs from the entities array
            const entityIDs = entities.map((entity) => entity[identifierKey]);
            console.log(`entities: ${JSON.stringify(entities)}`)
            console.log(`entityIDs: ${JSON.stringify(entityIDs)}`)

            // fetch related data
            const fetchResult = await service.fetchByEntityIDs(entityIDs, entityChildAuxKey || entityServiceType);
            console.log(`fetchResult: ${JSON.stringify(fetchResult)}`)

            if (fetchResult) {

                // map the fetched data back to the entities
                for (const entity of entities) {
                    const relatedData = fetchResult[entity[identifierKey]] || [];
                    entity[mapKey] =  relatedData.map((item) => item[`${mapKey as string}`]);
                    console.log(`relatedData: ${JSON.stringify(relatedData)}`)
                    console.log(`relatedDataMapped: ${JSON.stringify(relatedData.map((item) => item[`${mapKey as string}`]))}`)

                    // recursively fetch and map child relationships if needed
                    if (relatedData.length > 0) {
                        const childIdentifierKey = `entity_${mapKey as string}_id`;
                        console.log(`childIdentifierKey: ${childIdentifierKey}`)
                        const childAuxKey = `entity_${mapKey as string}`;
                        await this.fetchAndMap(relatedData, childIdentifierKey, childAuxKey);
                    }
                }
            }
        }

        return entities;
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

    // create new entity
    async create(createDto: TApiCreateDto): Promise<TDto> {
        const createContract: TApiCreateDto = { ...createDto };

        return await this.client.send<TDto, TCreateDto>(this.patterns.CREATE, createContract).toPromise();
    }

    // fetch all 
    async findAll(pageOptionsDto: PageOptionsDto): Promise<TDto[]> {
        return await this.client.send<TDto[]>(this.patterns.FIND_ALL, pageOptionsDto).toPromise();
    }

    // fetch single
    async findOne(id: string): Promise<TDto> {
        return await this.client.send<TDto>(this.patterns.FIND_ONE, id).toPromise();
    }

    // update entity as well as linked mappings
    async update(id: string, updateDto: TApiUpdateDto): Promise<TDto> {
        const updateContract: TApiUpdateDto = { ...updateDto };

        return await this.client
            .send<TDto, TUpdateDto>(this.patterns.UPDATE, { [this.tDtoID]: id, ...updateContract })
            .toPromise();
    }

    // remove and remove linked mappings as well
    async remove(id: string): Promise<void> {
        return await this.client.send<void>(this.patterns.DELETE, id).toPromise();
    }

    // create and process linked mappings
    // including intermediary table mappings.
    // E.g. property -> media via entity_media
    async createEntityFields<TDto>(
        entityId: string,
        propertyResponse: TDto,
        entityAuxType: any = null
    ): Promise<Record<string, any[]>> {
        const fieldResponses = await Promise.all(
            this.mappings.map(async ({ mapKey, service, entityType }) => {
                const data = (propertyResponse as any)[mapKey] || [];

                if (data && data.length > 0) {
                    // create and link the parent entities
                    const parentLinkedEntities = await service.createAndLinkEntities(
                        entityId,
                        entityAuxType || entityType,
                        data
                    );

                    console.log(`parentLinkedEntities: ${JSON.stringify(parentLinkedEntities)}`)

                    // process nested entities by using the linked parent IDs
                    const mergedEntities = await Promise.all(
                        parentLinkedEntities.map(async ({ created, linked }, index) => {
                            const linkedEntityIdKey = Object.keys(linked).find(
                                (key) => /^entity_.*_id$/.test(key)
                            );

                            // ID of the linked parent entity
                            const linkedEntityId = linked[linkedEntityIdKey];

                            const childFields = await service.createEntityFields(
                                linkedEntityId,
                                data[index],
                                `entity_${mapKey as String}`
                            );

                            // merge the nested fields into the parent entity
                            return { ...data[index], ...created, ...childFields };
                        })
                    );

                    return { [mapKey]: mergedEntities };
                }

                return { [mapKey]: [] };
            })
        );

        // combine all field responses into a single object
        return fieldResponses.reduce((acc, response) => ({ ...acc, ...response }), {});
    }

    // links an object to the entity table.
    // For e.g. property -> media
    async createAndLinkEntities(
        entityId: string,
        entityType: TDtoTypeEnum,
        entities: TCreateDto[]
    ): Promise< ConsolidatedEntity<TDto, TEntityDto>[]> {
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
            const linked  = linkedEntities[index] as LinkedEntity;
            const { created_at, updated_at, ...linkedWithoutTimestamps } = linked;

            return {
                created: { ...created },
                linked: { ...linkedWithoutTimestamps } as TEntityDto
            };
        });

        return consolidatedEntities;
    }

    // fetch by ids the linked mappings based on the entity_type
    async fetchByEntityIDs(entityIDs: string[], entityType: TDtoTypeEnum | undefined = null): Promise<Record<string, TDto[]>> {
        return await this.client
            .send<Record<string, TDto[]>>(this.patterns.FIND_BY_ENTITIES, {
                entity_ids: entityIDs,
                entity_type: entityType,
            })
            .toPromise();
    }

    // update and process linked mappings
    // including intermediary table mappings.
    async updateEntityFields(
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
                { [this.tDtoID]: entityId, ...updateEntityDtoContract }
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
                const existingEntityIds = existingEntities.map((e) => e[service.tDtoID]);
                const linkedEntityIdMap = existingEntities.reduce(
                    (acc, linked) => {
                        const linkedEntityIdKey = Object.keys(linked).find((key) => /^entity_.*_id$/.test(key));

                        if (linkedEntityIdKey) {
                            acc[linked.entity_id] = acc[linked.entity_id] || [];
                            acc[linked.entity_id].push(linked[linkedEntityIdKey]);
                        }
                        return acc;
                    },
                    {} as Record<string, string[]>
                );

                console.log(`linkedEntityIdMap for ${entityType}: ${JSON.stringify(linkedEntityIdMap)}`);
                console.log(`dataToUpdate for ${entityType}: ${JSON.stringify(dataToUpdate)}`);

                // separate new entities and existing entities to update
                const newEntities = dataToUpdate.filter((entity) => !entity[service.tDtoID]);
                const entitiesToUpdate = dataToUpdate.filter(
                    (entity) => entity[service.tDtoID] && existingEntityIds.includes(entity[service.tDtoID])
                );

                // create and link new entities
                const newEntityResponses = await service.createAndLinkEntities(entityId, entityAuxType || entityType, newEntities);
                // console.log(`entitiesToUpdate: ${JSON.stringify(entitiesToUpdate)}`)

                // update existing entities and handle nested fields
                const updatedEntityResponses = await Promise.all(
                    entitiesToUpdate.map(async (entity) => {
                        // get all linked entity IDs for the current entity
                        const linkedEntityIds = linkedEntityIdMap[entityId] || [];

                        // console.log(`entity: ${JSON.stringify(entity)}`)
                        // console.log(`mappingMappedKey: ${mappingMappedKey}`)
                        // console.log(`linkedEntityIds: ${linkedEntityIds}\n`)

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
        return { ...entityResponse, ...updatedFieldResponses };
    }

    // update entities in bulk
    async updateEntities(entities: TUpdateDto[]): Promise<TDto[]> {
        return await Promise.all(
            entities.map(
                (entity) => this.client.send<TDto, TUpdateDto>(this.patterns.UPDATE, entity).toPromise()
            )
        );
    }

    // remove entity linked mappings
    async removeEntityLinks(entityId: string, entityType: TDtoTypeEnum): Promise<void> {
        // ENTITY_PATTERN
        console.log(`removeEntityLinks : ${this.patterns.DELETE_BY_ENTITY} | ${entityId} | ${entityType} | ${entityType as String}\n`)

        await this.client
            .send<void>(this.patterns.DELETE_BY_ENTITY, { entity_id: entityId, entity_type: entityType })
            .toPromise();

    }

    // remove and process linked mappings
    // including intermediary table mappings.
    async removeEntityFields(entityId: string): Promise<void> {
        // dynamically remove all linked entities for all combinations of entity types and map keys
        await Promise.all(
            this.mappings.flatMap(({ service, entityType, mapKey }) => {
                console.log(`Processing removal for entity: ${entityId}, type: ${entityType}, mapKey: ${mapKey as String}`);

                // generate all possible combinations of mapKeys and remove links
                return this.mappings.flatMap(({ mapKey: otherMapKey }) => {
                    console.log(`Deleting: ${service.client["port"]} | ${entityId} | ${entityType} | entity_${otherMapKey as string}`);
                    return [
                        // remove prefixed entity type for the current mapKey
                        service.removeEntityLinks(entityId, `entity_${otherMapKey as string}`),

                        // remove base entity type for the current mapKey
                        service.removeEntityLinks(entityId, entityType)
                    ];
                });
            })
        );
        await this.client.send<void>(this.patterns.DELETE, entityId).toPromise();
    }

}