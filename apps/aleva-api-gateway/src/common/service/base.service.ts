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

    protected async fetchAndMapO(
        entities: TDto[],
        identifierKey: keyof TDto
    ): Promise<TDto[]> {
        const entityIds = entities.map((entity) => entity[identifierKey] as string);


        // fetch results for all top-level mappings
        const fetchResults = await Promise.all(
            this.mappings.flatMap(({ service, entityType }) => [
                service.fetchByEntityIDs(entityIds, entityType),
                service.fetchByEntityIDs(entityIds, `entity_${entityType}` as TDtoTypeEnum)
            ]
            )
        );

        console.log(`fetchResults: ${JSON.stringify(fetchResults)}`)
        const isEmptyObject = (obj) => Object.keys(obj).length === 0 && obj.constructor === Object;

        // map results for top-level entities
        fetchResults.forEach((fetchedData, index) => {
            // console.log(`this.mappings: ${JSON.stringify(this.mappings)}`)

            if (!isEmptyObject(fetchedData)) {
                console.log(`index: ${index}`)
                const { mapKey } = this.mappings[index];
                entities.forEach((entity) => {
                    const id = entity[identifierKey] as string;
                    (entity as any)[mapKey] = fetchedData[id] || [];
                });

            }
        });

        // process nested mappings recursively
        // for (const { mapKey, service } of this.mappings) {
        //     const nestedEntities = entities.flatMap((entity) => (entity as any)[mapKey] || []);
        //     if (nestedEntities.length > 0) {
        //         await service.fetchAndMap(nestedEntities, service.tDtoID);
        //     }
        // }

        return entities;
    }

    protected async fetchAndMap000(
        entities: TDto[],
        identifierKey: keyof TDto
    ): Promise<TDto[]> {
        const entityIds = entities.map((entity) => entity[identifierKey] as string);

        // Initialize an empty object to group results
        const groupedFetchResults: Record<string, Record<string, any[]>> = {};

        // Fetch and group results by `entityType` and `entity_${entityType}`
        await Promise.all(
            this.mappings.map(async ({ service, entityType }) => {
                const [mainResults] = await Promise.all([
                    service.fetchByEntityIDs(entityIds, null)
                ]);

                // Group results by `entityType`
                groupedFetchResults[`${entityType}`] = {
                    // ...(groupedFetchResults[`${entityType}`] || {}),
                    ...mainResults,
                };

                console.log(`mainResults for ${entityType}: ${JSON.stringify(mainResults)}`);
            })
        );

        console.log(`groupedFetchResults: ${JSON.stringify(groupedFetchResults)}`);

        const isEmptyObject = (obj: any) => Object.keys(obj).length === 0;

        // Map grouped results to the entities
        this.mappings.forEach(({ mapKey, entityType }) => {
            const result = groupedFetchResults[`${entityType}`] || {};
            const linkedResult = groupedFetchResults[`entity_${entityType}`] || {};

            // Merge results for `entityType` and `entity_${entityType}`
            const combinedResults = { ...result, ...linkedResult };

            if (!isEmptyObject(combinedResults)) {
                entities.forEach((entity) => {
                    const id = entity[identifierKey] as string;
                    (entity as any)[mapKey] = combinedResults[id] || [];
                });
            }
        });

        return entities;
    }

    protected async fetchAndMapP(
        entities: TDto[],
        identifierKey: keyof TDto,
        entityAuxType: any = null
    ): Promise<TDto[]> {
        const entityIds = entities.map((entity) => entity[identifierKey] as string);

        console.log(`entityIds: ${JSON.stringify(entityIds)}`)

        // group results for main and linked entities
        const groupedFetchResults: Record<string, Record<string, any[]>> = {};

        await Promise.all(
            this.mappings.map(async ({ service, entityType, mapKey }) => {
                const existingEntities = (await service.fetchByEntityIDs(entityIds, entityAuxType || entityType)) || [];

                console.log(`existingEntities: ${JSON.stringify(existingEntities)}`)
                // Fetch results for both `entityType` and `entity_${entityType}`
                // const [mainResults, linkedResults] = await Promise.all([
                //     service.fetchByEntityIDs(entityIds, entityType),
                //     service.fetchByEntityIDs(entityIds, `entity_${entityType}`),
                // ]);

                // // Group results for main entity type
                // groupedFetchResults[`${entityType as string}`] = {
                //     ...(groupedFetchResults[`${entityType as string}`] || {}),
                //     ...mainResults,
                // };

                // // Group results for linked entity type
                // groupedFetchResults[`entity_${entityType}`] = {
                //     ...(groupedFetchResults[`entity_${entityType}`] || {}),
                //     ...linkedResults,
                // };

                // console.log(`Fetched mainResults for ${entityType}: ${JSON.stringify(mainResults)}`);
                // console.log(`Fetched linkedResults for entity_${entityType}: ${JSON.stringify(linkedResults)}`);
            })
        );

        // console.log(`Grouped Fetch Results: ${JSON.stringify(groupedFetchResults)}`);

        // // Helper function to check if an object is empty
        // const isEmptyObject = (obj: any) => Object.keys(obj).length === 0;

        // // Map grouped results back to entities
        // this.mappings.forEach(({ mapKey, entityType }) => {
        //     const mainResults = groupedFetchResults[`${entityType as string}`] || {};
        //     const linkedResults = groupedFetchResults[`entity_${entityType}`] || {};

        //     // Merge main and linked results for the entity type
        //     const combinedResults = { ...mainResults, ...linkedResults };

        //     if (!isEmptyObject(combinedResults)) {
        //         entities.forEach((entity) => {
        //             const id = entity[identifierKey] as string;
        //             // Assign mapped results to the entity's mapKey
        //             (entity as any)[mapKey] = combinedResults[id] || [];
        //         });
        //     }
        // });

        return entities;
    }

    protected async fetchAndMapKK(
        entities: TDto[],
        identifierKey: keyof TDto,
        entityAuxType: any = null
    ): Promise<TDto[]> {
        const entityIds = entities.map((entity) => entity[identifierKey] as string);

        console.log(`entityIds: ${JSON.stringify(entityIds)}`)

        // group results for main and linked entities
        const groupedFetchResults: Record<string, Record<string, any[]>> = {};

        await Promise.all(
            this.mappings.map(async ({ service, entityType, mapKey }) => {
                const existingEntities = (await service.fetchByEntityIDs(entityIds, entityAuxType || entityType)) || [];

                console.log(`existingEntities: ${JSON.stringify(existingEntities)}`)
            })
        );

        return entities;
    }

    protected async fetchAndMap(
        entities: TDto[],
        identifierKey: keyof TDto,
        entityAuxType: any = null
    ): Promise<TDto[]> {
        // Validate input
        if (!Array.isArray(entities)) {
            console.error("Invalid input: entities is not an array", entities);
            throw new TypeError("entities must be an array");
        }
    
        const entityIds = entities.map((entity) => entity[identifierKey] as string);
        console.log(`entityIds: ${JSON.stringify(entityIds)}`);
    
        // Initialize a structure to store grouped results
        const groupedFetchResults: Record<string, any[]> = {};
    
        // Process mappings and fetch linked/related data
        await Promise.all(
            this.mappings.map(async ({ service, entityType, mapKey }) => {
                const mappingMappedKey = `${mapKey as string}`;
    
                // Fetch existing entities
                const existingEntities = (await service.fetchByEntityIDs(entityIds, entityAuxType || entityType)) || [];
                console.log(`existingEntities for ${entityType}: ${JSON.stringify(existingEntities)}`);
    
                // Build a map of linked entity IDs for recursive fetching
                const linkedEntityIdMap = Object.keys(existingEntities).reduce(
                    (acc, parentId) => {
                        const entityList = existingEntities[parentId] || [];
                        entityList.forEach((entity) => {
                            const linkedEntityIdKey = Object.keys(entity).find((key) => /^entity_.*_id$/.test(key));
                            if (linkedEntityIdKey) {
                                acc[parentId] = acc[parentId] || [];
                                acc[parentId].push(entity[linkedEntityIdKey]);
                            }
                        });
                        return acc;
                    },
                    {} as Record<string, string[]>
                );
    
                console.log(`linkedEntityIdMap for ${entityType}: ${JSON.stringify(linkedEntityIdMap)}`);
    
                // Recursively fetch child entities for each parent
                const updatedEntities = await Promise.all(
                    Object.entries(linkedEntityIdMap).map(async ([parentId, linkedIds]) => {
                        const childResponses = await Promise.all(
                            linkedIds.map((linkedId) =>
                                this.fetchAndMap(
                                    [{ [identifierKey]: linkedId }] as TDto[], // Recursive fetch for the child
                                    identifierKey,
                                    `entity_${mappingMappedKey}`
                                )
                            )
                        );
    
                        // Merge child responses
                        const mergedChildren = childResponses.flat().reduce((acc, child) => {
                            acc.push(child);
                            return acc;
                        }, []);
    
                        return {
                            parentId,
                            linkedData: mergedChildren,
                        };
                    })
                );
    
                groupedFetchResults[mappingMappedKey] = updatedEntities;
            })
        );
    
        console.log(`groupedFetchResults: ${JSON.stringify(groupedFetchResults)}`);
    
        // Map grouped results to the entities
        entities.forEach((entity) => {
            this.mappings.forEach(({ mapKey }) => {
                const mappingMappedKey = mapKey === "amenities" ? "amenities" : `${mapKey as string}`;
                const results = groupedFetchResults[mappingMappedKey] || [];
                const id = entity[identifierKey] as string;
                (entity as any)[mapKey] = results.filter((result) => result.parentId === id).map((res) => res.linkedData);
            });
        });
    
        return entities;
    }


    protected async fetchAndMaps(
        entities: TDto[],
        identifierKey: keyof TDto,
        entityAuxType: any = null
    ): Promise<TDto[]> {
        const entityIds = entities.map((entity) => entity[identifierKey] as string);
        
        // initialize grouped fetch results
        const groupedFetchResults: Record<string, any[]> = {};
        
        // process and map results for all mappings
        await Promise.all(
            this.mappings.map(async ({ service, entityType, mapKey }) => {
                const mappingMappedKey = mapKey == "amenities" ? "amenity" : `${mapKey as string}`;
    
                const existingEntities = (await service.fetchByEntityIDs(entityIds, entityAuxType || entityType)) || [];
                // console.log(`existingEntities: ${JSON.stringify(existingEntities)}`);
        
                // build linkedEntityIdMap
                const linkedEntityIdMap = Object.keys(existingEntities).reduce(
                    (acc, parentId) => {
                        const entityList = existingEntities[parentId] || [];
                        entityList.forEach((entity) => {
                            const linkedEntityIdKey = Object.keys(entity).find((key) => /^entity_.*_id$/.test(key));
                            
                            if (linkedEntityIdKey) {
                                acc[entity.entity_id] = acc[entity.entity_id] || [];
                                acc[entity.entity_id].push(entity[linkedEntityIdKey]);
                            }
                        });
                        return acc;
                    },
                    {} as Record<string, string[]>
                );
        
                console.log(`linkedEntityIdMap for ${entityType}: ${JSON.stringify(linkedEntityIdMap)}`);

                // Fetch and map child entities recursively
                const parentResult: any[] = [];

                for (const parentId of Object.keys(linkedEntityIdMap)) {
                    const entityList = existingEntities[parentId] || [];
                    console.log(`entityList: ${JSON.stringify(entityList)}`)
                }

            })
        );
        
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
    ): Promise<{ created: TDto; linked: TEntityDto }[]> {
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
        const consolidatedEntities = createdEntities.map((created, index) => {
            const linked = linkedEntities[index];
            const { created_at, updated_at, ...linkedWithoutTimestamps } = linked;

            return {
                created: { ...created },
                linked: { ...linkedWithoutTimestamps }
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