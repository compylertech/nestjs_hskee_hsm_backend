import { ClientProxy } from '@nestjs/microservices';

// meta
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

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

    // fetch and map respective detail mappings
    protected async fetchAndMapOld(
        entities: TDto[],
        identifierKey: keyof TDto
    ): Promise<TDto[]> {
        const entityIds = entities.map((entity) => entity[identifierKey] as string);

        const fetchResults = await Promise.all(
            this.mappings.map(({ service, entityType }) =>
                service.fetchByEntityIDs(entityIds, entityType)
            )
        );

        fetchResults.forEach((fetchedData, index) => {
            const { mapKey } = this.mappings[index];

            entities.forEach((entity) => {
                const id = entity[identifierKey] as string;
                (entity as any)[mapKey] = fetchedData[id] || [];
            });
        });

        return entities;
    }

    protected async fetchAndMap(
        entities: TDto[],
        identifierKey: keyof TDto
    ): Promise<TDto[]> {
        const entityIds = entities.map((entity) => entity[identifierKey] as string);

        // fetch results for all top-level mappings
        const fetchResults = await Promise.all(
            this.mappings.map(({ service, entityType }) =>
                service.fetchByEntityIDs(entityIds, entityType)
            )
        );

        // map results for top-level entities
        fetchResults.forEach((fetchedData, index) => {
            const { mapKey } = this.mappings[index];
            entities.forEach((entity) => {
                const id = entity[identifierKey] as string;
                (entity as any)[mapKey] = fetchedData[id] || [];
            });
        });

        // process nested mappings recursively
        for (const { mapKey, service } of this.mappings) {
            const nestedEntities = entities.flatMap((entity) => (entity as any)[mapKey] || []);
            if (nestedEntities.length > 0) {
                await service.fetchAndMap(nestedEntities, service.tDtoID);
            }
        }

        return entities;
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
                    // process the nested entities
                    const linkedEntities = await Promise.all(
                        data.map(async (item: any) => {
                            const childFields = await service.createEntityFields(item[service.tDtoID] || entityId, item, `entity_${entityType}`);
                            return { ...item, ...childFields };
                        })
                    );

                    // link the entities to the parent
                    const linked = await service.createAndLinkEntities(entityId, entityAuxType || entityType, linkedEntities);

                    // merge `linked` results back into `linkedEntities`
                    const mergedEntities = linked.map((enriched, index) => ({
                        ...linkedEntities[index],
                        ...enriched,
                    }));

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
    ): Promise<TDto[]> {
        const createdEntities = await Promise.all(
            entities.map((entity) =>
                this.client.send<TDto, TCreateDto>(this.patterns.CREATE, entity).toPromise()
            )
        );

        const links = await this.createEntityLinks<TDto, TEntityCreateDto>(
            createdEntities,
            entityId,
            entityType as TDtoTypeEnum
        );


        // ENTITY_PATTERN
        await Promise.all(
            links.map((link) =>
                this.client.send<TEntityDto, TEntityCreateDto>(this.patterns.LINK_ENTITY, link).toPromise()
            )
        );

        return createdEntities;
    }

    // create entity linked mapping
    private async createEntityLinks<TDto, TEntityDto>(
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

    // fetch by ids the linked mappings based on the entity_type
    async fetchByEntityIDs(entityIDs: string[], entityType: TDtoTypeEnum): Promise<Record<string, TDto[]>> {
        console.log(`\tfetchByEntityIDs: ${JSON.stringify(entityIDs)}\n\t${entityType as String}\n\t${this.patterns.FIND_BY_ENTITIES}\n`)
        return await this.client
            .send<Record<string, TDto[]>>(this.patterns.FIND_BY_ENTITIES, {
                entity_ids: entityIDs,
                entity_type: entityType,
            })
            .toPromise();
    }

    // update and process linked mappings
    // including intermediary table mappings.
    async updateEntityFieldsOld(entityId: string, updateEntityDto: TApiUpdateDto, updateEntityDtoContract: TUpdateDto): Promise<TDto> {

        const updatedFieldResponses: Record<string, any[]> = {};

        // update details
        const entityResponse = await this.client
            .send<TDto, TUpdateDto>(
                this.patterns.UPDATE,
                { [this.tDtoID]: entityId, ...updateEntityDtoContract }
            )
            .toPromise();
            
        // process updates dynamically for all mappings
        for (const { service, entityType, mapKey } of this.mappings) {
            const dataToUpdate = (updateEntityDto as any)[mapKey] || [];
            const mapKeyIdString: string = mapKey as string;

            if (dataToUpdate && dataToUpdate.length > 0) {
                const existingEntities = await service.fetchByEntityIDs([entityId], entityType);

                const existingEntityIds = (existingEntities[entityId] || []).map((e) => e[service.tDtoID]);

                const newEntities = dataToUpdate.filter((entity) => !entity[service.tDtoID]);
                const entitiesToUpdate = dataToUpdate.filter((entity) => entity[service.tDtoID] && existingEntityIds.includes(entity[service.tDtoID]));

                const newEntityResponses = await service.createAndLinkEntities(entityId, entityType, newEntities);
                const updatedEntityResponses = await service.updateEntities(entitiesToUpdate);

                updatedFieldResponses[mapKeyIdString] = [...newEntityResponses, ...updatedEntityResponses];
            } else {
                updatedFieldResponses[mapKeyIdString] = [];
            }
        }

        // merge updated field responses with property response
        return { ...entityResponse, ...updatedFieldResponses };
    }

    async updateEntityFields(
        entityId: string,
        updateEntityDto: TApiUpdateDto,
        updateEntityDtoContract: TUpdateDto,
        entityAuxType: any = null
    ): Promise<TDto> {
        const updatedFieldResponses: Record<string, any[]> = {};
    
        // update details
        const entityResponse = await this.client
            .send<TDto, TUpdateDto>(
                this.patterns.UPDATE,
                { [this.tDtoID]: entityId, ...updateEntityDtoContract }
            )
            .toPromise();
    
        // process updates dynamically for all mappings
        for (const { service, entityType, mapKey } of this.mappings) {
            const dataToUpdate = (updateEntityDto as any)[mapKey] || [];
            const mapKeyIdString: string = mapKey as string;
    
            if (dataToUpdate && dataToUpdate.length > 0) {
                const existingEntities = await service.fetchByEntityIDs([entityId], entityAuxType || entityType);
                const existingEntityIds = (existingEntities[entityId] || []).map((e) => e[service.tDtoID]);
    
                const newEntities = dataToUpdate.filter((entity) => !entity[service.tDtoID]);
                const entitiesToUpdate = dataToUpdate.filter(
                    (entity) => entity[service.tDtoID] && existingEntityIds.includes(entity[service.tDtoID])
                );
    
                // create new entities and link them
                const newEntityResponses = await service.createAndLinkEntities(entityId, entityAuxType || entityType, newEntities);
    
                // update existing entities and handle nested fields
                const updatedEntityResponses = await Promise.all(
                    entitiesToUpdate.map(async (entity) => {
                        const nestedFieldResponse = await service.updateEntityFields(
                            entityId || entity[service.tDtoID], // TODO: Consider how nested children are stored.
                            entity,
                            entity,
                            `entity_${entityType}`
                        ); // recursive call for nested children
                        return { ...nestedFieldResponse, ...entity };
                    })
                );
    
                updatedFieldResponses[mapKeyIdString] = [...newEntityResponses, ...updatedEntityResponses];
            } else {
                updatedFieldResponses[mapKeyIdString] = [];
            }
        }
    
        // merge updated field responses with entity response
        return { ...entityResponse, ...updatedFieldResponses };
    }
 
    // update entities in bulk
    async updateEntities(entities: TUpdateDto[]): Promise<TDto[]> {
        console.log(`In here: ${JSON.stringify(entities)}`)
        return await Promise.all(
            entities.map(
                (entity) => this.client.send<TDto, TUpdateDto>(this.patterns.UPDATE, entity).toPromise()
            )
        );
    }

    // remove entity linked mappings
    async removeEntityLinks(entityId: string, entityType: TDtoTypeEnum): Promise<void> {
        // ENTITY_PATTERN
        await this.client
            .send<void>(this.patterns.DELETE_BY_ENTITY, { entity_id: entityId, entity_type: entityType })
            .toPromise();
    }

    // remove and process linked mappings
    // including intermediary table mappings.
    async removeEntityFields(entityId: string): Promise<void> {
        // remove all linked entities dynamically
        await Promise.all(
            this.mappings.map(({ service, entityType }) =>
                service.removeEntityLinks(entityId, entityType)
            )
        );

        await Promise.all(
            this.mappings.map(({ service, entityType }) =>
                service.removeEntityLinks(entityId, `entity_${entityType}`)
            )
        );

        // remove the property
        await this.client.send<void>(this.patterns.DELETE, entityId).toPromise();
    }
}