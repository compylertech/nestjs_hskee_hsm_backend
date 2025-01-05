
protected async fetchAndMapas(
    entities: TDto[],
    identifierKey: keyof TDto,
    entityAuxType: any = null
): Promise<TDto[]> {
    const entityIds = Array.from(
        new Set(entities.map((entity) => entity[identifierKey] as string))
    );

    console.log(`entityIds: ${JSON.stringify(entityIds)}`);
    console.log(`entities: ${JSON.stringify(entities)}`);

    // process each mapping to fetch top-level and linked child entities
    await Promise.all(
        this.mappings.map(async ({ service, entityType, mapKey }) => {
            const mappingMappedKey = `${mapKey as string}`;

            // fetch top-level entities for the current mapping
            const existingEntities = await service.fetchByEntityIDs(entityIds, entityAuxType || entityType);
            console.log(`existingEntities for ${mapKey as string}: ${JSON.stringify(existingEntities)}`);

            if (!existingEntities) return;

            // map linked entity IDs
            const linkedEntityIdMap = Object.keys(existingEntities).reduce((acc, parentId) => {
                const entityList = existingEntities[parentId] || [];
                entityList.forEach((entity) => {
                    const linkedEntityIdKey = Object.keys(entity).find((key) =>
                        /^entity_.*_id$/.test(key)
                    );

                    if (linkedEntityIdKey) {
                        acc[parentId] = acc[parentId] || {
                            parentId,
                            entityId: [],
                            childMapKey: mappingMappedKey,
                            mapKey: entity['entity_type'],
                        };
                        acc[parentId].entityId.push(entity[linkedEntityIdKey]);
                    }
                });
                return acc;
            }, {} as Record<string, { parentId: string; entityId: string[]; mapKey: string; childMapKey: string }>);

            console.log(`linkedEntityIdMap for ${entityType}: ${JSON.stringify(linkedEntityIdMap)}`);

            // map top-level results to the entities
            entities.forEach((entity) => {
                const id = entity[identifierKey] as string;
                if (existingEntities[id]) {
                    entity[mappingMappedKey] = existingEntities[id].map((result) => result[mapKey]);
                }
            });

            // recursively fetch child entities
            await Promise.all(
                Object.values(linkedEntityIdMap).map(async (linkedEntity) => {
                    console.log(
                        `linkedEntityIdMap for table: entity_${linkedEntity["childMapKey"]} | entity_type: ${linkedEntity["mapKey"]}`
                    );

                    if (linkedEntity["entityId"].length > 0) {
                        const childEntities = await Promise.all(
                            linkedEntity["entityId"].map((linkedId) =>
                                this.fetchAndMap(
                                    existingEntities[linkedEntity.parentId].map((entity) => ({
                                        // ...entity,
                                        ...entity[linkedEntity["childMapKey"]],
                                        [`entity_key`]: linkedId,
                                    })) as TDto[],
                                    `entity_key` as keyof TDto,
                                    `entity_${linkedEntity["childMapKey"]}`
                                )
                            )
                        );

                        console.log(`childEntities for ${linkedEntity.mapKey}: ${JSON.stringify(childEntities)}`);

                        // attach child entities to the parent
                        entities.forEach((entity) => {
                            const id = entity[identifierKey] as string;
                            if (id === linkedEntity.parentId) {
                                entity[linkedEntity.childMapKey] = childEntities.flat();
                            }
                        });
                    }
                })
            );
        })
    );

    console.log(`Final mapped entities: ${JSON.stringify(entities)}`);
    return entities;
}

protected async fetchAndMaps(
    entities: TDto[],
    identifierKey: keyof TDto,
    entityAuxType: any = null
): Promise<TDto[]> {
    const entityIds = entities.map((entity) => entity[identifierKey] as string);

    console.log(`entityIds: ${JSON.stringify(entityIds)}`);
    console.log(`entities: ${JSON.stringify(entities)}`);

    await Promise.all(
        this.mappings.map(async ({ service, entityType, mapKey }) => {
            const mappingMappedKey = `${mapKey as string}`;

            const existingEntities = await service.fetchByEntityIDs(entityIds, entityAuxType || entityType);
            console.log(`existingEntities for ${mapKey as string}: ${JSON.stringify(existingEntities)}`);

            if (!existingEntities) return;

            const linkedEntityIdMap = Object.keys(existingEntities).reduce((acc, parentId) => {
                const entityList = existingEntities[parentId] || [];
                entityList.forEach((entity) => {
                    const linkedEntityIdKey = Object.keys(entity).find((key) =>
                        /^entity_.*_id$/.test(key)
                    );

                    if (linkedEntityIdKey) {
                        acc[parentId] = acc[parentId] || {
                            parentId,
                            entityId: [],
                            childMapKey: mappingMappedKey,
                            mapKey: entity["entity_type"],
                        };
                        acc[parentId].entityId.push(entity[linkedEntityIdKey]);
                    }
                });
                return acc;
            }, {} as Record<string, { parentId: string; entityId: string[]; mapKey: string; childMapKey: string }>);

            Object.values(linkedEntityIdMap).forEach((item) => {
                item.entityId = Array.from(item.entityId);
            });

            entities.forEach((entity) => {
                const id = entity[identifierKey] as string;
                if (existingEntities[id]) {
                    const uniqueResults = new Map<string, any>();
                    existingEntities[id].forEach((result) => {
                        const key = result[mapKey];
                        if (!uniqueResults.has(key)) uniqueResults.set(key, result);
                    });
                    entity[mappingMappedKey] = Array.from(uniqueResults.values());
                }
            });

            await Promise.all(
                Object.values(linkedEntityIdMap).map(async (linkedEntity) => {
                    console.log(
                        `linkedEntityIdMap for table: entity_${linkedEntity["childMapKey"]} | entity_type: ${linkedEntity["mapKey"]}`
                    );

                    if (linkedEntity["entityId"].length > 0) {
                        const uniqueEntityIds = Array.from(new Set(linkedEntity["entityId"]));
                        const childEntities = await Promise.all(
                            uniqueEntityIds.map((linkedId) =>
                                this.fetchAndMap(
                                    existingEntities[linkedEntity.parentId].map((entity) => ({
                                        ...entity[linkedEntity["childMapKey"]],
                                        [`entity_key`]: linkedId,
                                    })) as TDto[],
                                    `entity_key` as keyof TDto,
                                    `entity_${linkedEntity["childMapKey"]}`
                                )
                            )
                        );

                        console.log(`childEntities for ${linkedEntity.mapKey}: ${JSON.stringify(childEntities)}`);

                        entities.forEach((entity) => {
                            const id = entity[identifierKey] as string;
                            if (id === linkedEntity.parentId) {
                                entity[linkedEntity.childMapKey] = childEntities.flat();
                            }
                        });
                    }
                })
            );
        })
    );

    // Deduplication logic for entities
    entities.forEach((entity) => {
        Object.keys(entity).forEach((key) => {
            if (Array.isArray(entity[key])) {
                // Deduplicate top-level array fields
                entity[key] = Array.from(
                    new Map(entity[key].map((item) => [JSON.stringify(item), item])).values()
                );

                // Deduplicate nested arrays within each item in the array
                entity[key].forEach((nestedItem) => {
                    if (typeof nestedItem === "object" && nestedItem !== null) {
                        Object.keys(nestedItem).forEach((nestedKey) => {
                            if (Array.isArray(nestedItem[nestedKey])) {
                                // Deduplicate nested arrays
                                nestedItem[nestedKey] = Array.from(
                                    new Map(
                                        nestedItem[nestedKey].map((nestedArrayItem) => [
                                            JSON.stringify(nestedArrayItem),
                                            nestedArrayItem,
                                        ])
                                    ).values()
                                );
                            }
                        });
                    }
                });
            }
        });
    });

    console.log(`Final mapped entities: ${JSON.stringify(entities)}`);
    return entities;
}

protected async fetchAndMapHMM(
    entities: TDto[],
    identifierKey: keyof TDto,
    entityAuxType: any = null
): Promise<TDto[]> {
    const entityIds = Array.from(
        new Set(entities.map((entity) => entity[identifierKey] as string))
    );

    console.log(`entityIds: ${JSON.stringify(entityIds)}`);
    console.log(`entities: ${JSON.stringify(entities)}`);

    // Track processed child entity keys to avoid duplicates
    const processedChildKeys = new Set<string>();

    // Process each mapping to fetch top-level and linked child entities
    await Promise.all(
        this.mappings.map(async ({ service, entityType, mapKey }) => {
            const mappingMappedKey = `${mapKey as string}`;

            // Fetch top-level entities for the current mapping
            const existingEntities = await service.fetchByEntityIDs(entityIds, entityAuxType || entityType);
            console.log(`existingEntities for ${mapKey as string}: ${JSON.stringify(existingEntities)}`);

            if (!existingEntities) return;

            // Map linked entity IDs
            const linkedEntityIdMap = Object.keys(existingEntities).reduce((acc, parentId) => {
                const entityList = existingEntities[parentId] || [];
                entityList.forEach((entity) => {
                    const linkedEntityIdKey = Object.keys(entity).find((key) =>
                        /^entity_.*_id$/.test(key)
                    );

                    if (linkedEntityIdKey) {
                        acc[parentId] = acc[parentId] || {
                            parentId,
                            entityId: [],
                            childMapKey: mappingMappedKey,
                            mapKey: entity['entity_type'],
                        };
                        acc[parentId].entityId.push(entity[linkedEntityIdKey]);
                    }
                });
                return acc;
            }, {} as Record<string, { parentId: string; entityId: string[]; mapKey: string; childMapKey: string }>);

            console.log(`linkedEntityIdMap for ${entityType}: ${JSON.stringify(linkedEntityIdMap)}`);

            // Map top-level results to the entities
            entities.forEach((entity) => {
                const id = entity[identifierKey] as string;
                if (existingEntities[id]) {
                    entity[mappingMappedKey] = existingEntities[id].map((result) => result[mapKey]);
                }
            });

            // Recursively fetch child entities
            await Promise.all(
                Object.values(linkedEntityIdMap).map(async (linkedEntity) => {
                    console.log(
                        `linkedEntityIdMap for table: entity_${linkedEntity["childMapKey"]} | entity_type: ${linkedEntity["mapKey"]}`
                    );

                    if (linkedEntity["entityId"].length > 0) {
                        const childEntities = await Promise.all(
                            linkedEntity["entityId"].map(async (linkedId) => {
                                const parentEntities = existingEntities[linkedEntity.parentId];

                                // Filter child entities before processing
                                const childData = parentEntities
                                    .map((entity) => entity[linkedEntity["childMapKey"]] || [])
                                    .map((child) => ({
                                        ...child,
                                        [`entity_key`]: linkedId,
                                    }))
                                    .filter((child) => {
                                        // const key = `${linkedEntity.parentId}-${linkedEntity["childMapKey"]}-${child[`${service.tDtoID}`]}-${linkedId}`;

                                        const key = `${child[`${service.tDtoID}`]}-${linkedEntity["childMapKey"]}-${linkedId}`;

                                        console.log(`keyMAPPED ${key} | ${JSON.stringify(child)}`)
                                        if (processedChildKeys.has(key)) {
                                            return false;
                                        }
                                        processedChildKeys.add(key);
                                        return true;
                                    });

                                // Recursively call fetchAndMap for child entities
                                return await this.fetchAndMap(
                                    childData as TDto[],
                                    `entity_key` as keyof TDto,
                                    `entity_${linkedEntity["childMapKey"]}`
                                );
                            })
                        );

                        console.log(`childEntities for ${linkedEntity.mapKey}: ${JSON.stringify(childEntities)}`);

                        // Attach child entities to the parent
                        entities.forEach((entity) => {
                            const id = entity[identifierKey] as string;
                            if (id === linkedEntity.parentId) {
                                entity[linkedEntity.childMapKey] = childEntities.flat();
                            }
                        });
                    }
                })
            );
        })
    );

    console.log(`Final mapped entities: ${JSON.stringify(entities)}`);
    return entities;
}

protected async fetchAndMapP(
    entities: TDto[],
    identifierKey: keyof TDto,
    entityAuxType: any = null
): Promise<TDto[]> {
    console.log(`Starting fetchAndMap with entities: ${JSON.stringify(entities)}`);

    const entityIds = Array.from(new Set(entities.map((entity) => entity[identifierKey] as string)));

    // Process each mapping
    for (const { service, entityType, mapKey } of this.mappings) {
        const mappingMappedKey = `${mapKey as string}`;

        console.log(`\tProcessing service: ${service.tDtoID}, entityType: ${entityType}, mapKey: ${mapKey as string}, ${JSON.stringify(entityIds)}`);

        try {
            const existingEntities = await service.fetchByEntityIDs(entityIds, entityAuxType || entityType).catch((error) => {
                console.log(`Error fetching entities for ${service.tDtoID}:`, error);
                return null;
            });

            if (!existingEntities) {
                console.warn(`No entities returned for ${service.tDtoID}`);
                continue;
            }

            console.log(`\tFetched entities: ${JSON.stringify(existingEntities)}`);

            const linkedEntityIdMap = Object.keys(existingEntities).reduce((acc, parentId) => {
                const entityList = existingEntities[parentId] || [];
                entityList.forEach((entity) => {
                    const linkedEntityIdKey = Object.keys(entity).find((key) => /^entity_.*_id$/.test(key));
                    if (linkedEntityIdKey) {
                        acc[parentId] = acc[parentId] || { parentId, entityId: [], childMapKey: mappingMappedKey, mapKey: entity["entity_type"] };
                        acc[parentId].entityId.push(entity[linkedEntityIdKey]);
                    }
                });
                return acc;
            }, {} as Record<string, { parentId: string; entityId: string[]; mapKey: string; childMapKey: string }>);

            entities.forEach((entity) => {
                const id = entity[identifierKey] as string;
                if (existingEntities[id]) {
                    entity[mappingMappedKey] = existingEntities[id].map((result) => result[mapKey]);
                }
            });

            await Promise.all(
                Object.values(linkedEntityIdMap).map(async (linkedEntity) => {
                    if (linkedEntity.entityId.length > 0) {
                        const childEntities = await Promise.all(
                            linkedEntity.entityId.map((linkedId) =>
                                this.fetchAndMap(
                                    (existingEntities[linkedEntity.parentId] || []).map((entity) => ({
                                        ...entity[linkedEntity.childMapKey],
                                        entity_key: linkedId,
                                    })) as TDto[],
                                    "entity_key" as keyof TDto,
                                    `entity_${linkedEntity.childMapKey}`
                                )
                            )
                        );
                        entities.forEach((entity) => {
                            if (entity[identifierKey] === linkedEntity.parentId) {
                                entity[linkedEntity.childMapKey] = childEntities.flat();
                            }
                        });
                    }
                })
            );
        } catch (error) {
            console.error(`Error processing mapping for ${mapKey as string}:`, error);
        }
    }

    console.log(`Final mapped entities: ${JSON.stringify(entities)}`);
    return entities;
}

protected async fetchAndMapasasa(
    entities: TDto[],
    identifierKey: keyof TDto,
    entityAuxType: any = null,
    processedEntities = new Set<string>() // Track processed entity IDs
): Promise<TDto[]> {
    console.log(`Starting fetchAndMap with entities: ${JSON.stringify(entities)}`);

    const entityIds = Array.from(
        new Set(entities.map((entity) => entity[identifierKey] as string))
    );

    // Filter out already processed IDs
    const unprocessedEntityIds = entityIds.filter((id) => !processedEntities.has(id));

    if (unprocessedEntityIds.length === 0) {
        console.log(`All entities already processed for ${identifierKey}`);
        return entities;
    }

    // Add unprocessed IDs to the processed set
    unprocessedEntityIds.forEach((id) => processedEntities.add(id));

    for (const { service, entityType, mapKey } of this.mappings) {
        const mappingMappedKey = `${mapKey as string}`;

        console.log(
            `\tProcessing service: ${service.tDtoID}, entityType: ${entityType}, mapKey: ${mapKey}, ${JSON.stringify(unprocessedEntityIds)}`
        );

        try {
            const existingEntities = await service
                .fetchByEntityIDs(unprocessedEntityIds, entityAuxType || entityType)
                .catch((error) => {
                    console.error(`Error fetching entities for ${service.tDtoID}:`, error);
                    return null;
                });

            if (!existingEntities) {
                console.warn(`No entities returned for ${service.tDtoID}`);
                continue;
            }

            console.log(`\tFetched entities: ${JSON.stringify(existingEntities)}`);

            // Map entities and their linked entities
            const linkedEntityIdMap = Object.keys(existingEntities).reduce(
                (acc, parentId) => {
                    const entityList = existingEntities[parentId] || [];
                    entityList.forEach((entity) => {
                        const linkedEntityIdKey = Object.keys(entity).find((key) =>
                            /^entity_.*_id$/.test(key)
                        );
                        if (linkedEntityIdKey) {
                            acc[parentId] = acc[parentId] || {
                                parentId,
                                entityId: [],
                                childMapKey: mappingMappedKey,
                                mapKey: entity["entity_type"],
                            };
                            acc[parentId].entityId.push(entity[linkedEntityIdKey]);
                        }
                    });
                    return acc;
                },
                {} as Record<string, { parentId: string; entityId: string[]; mapKey: string; childMapKey: string }>
            );

            entities.forEach((entity) => {
                const id = entity[identifierKey] as string;
                if (existingEntities[id]) {
                    entity[mappingMappedKey] = existingEntities[id].map(
                        (result) => result[mapKey]
                    );
                }
            });

            // Process child entities recursively
            await Promise.all(
                Object.values(linkedEntityIdMap).map(async (linkedEntity) => {
                    if (linkedEntity.entityId.length > 0) {
                        console.log(`linkedEntity.entityId: ${JSON.stringify(linkedEntity.entityId)}`)
                        const childEntities = await this.fetchAndMap(
                            (existingEntities[linkedEntity.parentId] || []).map((entity) => ({
                                ...entity[linkedEntity.childMapKey],
                                entity_key: linkedEntity.entityId,
                            })) as TDto[],
                            "entity_key" as keyof TDto,
                            `entity_${linkedEntity.childMapKey}`,
                            processedEntities // Pass processed set
                        );

                        entities.forEach((entity) => {
                            if (entity[identifierKey] === linkedEntity.parentId) {
                                entity[linkedEntity.childMapKey] = childEntities.flat();
                            }
                        });
                    }
                })
            );
        } catch (error) {
            console.error(`Error processing mapping for ${mapKey}:`, error);
        }
    }

    console.log(`Final mapped entities: ${JSON.stringify(entities)}`);
    return entities;
}

protected async fetchAndMapman(
    entities: TDto[],
    identifierKey: keyof TDto,
    entityAuxType: any = null
): Promise<TDto[]> {
    console.log(`Starting fetchAndMap with entities: ${JSON.stringify(entities)}`);

    const entityIds = Array.from(new Set(entities.map((entity) => entity[identifierKey] as string)));
    const processedEntities = new Set<string>(); // Track processed entity IDs

    // Process each mapping
    for (const { service, entityType, mapKey } of this.mappings) {
        const mappingMappedKey = `${mapKey as string}`;

        console.log(`\tProcessing service: ${service.tDtoID}, entityType: ${entityType}, mapKey: ${mapKey as string}, ${JSON.stringify(entityIds)}`);

        try {
            const existingEntities = await service.fetchByEntityIDs(entityIds, entityAuxType || entityType).catch((error) => {
                console.log(`Error fetching entities for ${service.tDtoID}:`, error);
                return null;
            });

            if (!existingEntities) {
                console.warn(`No entities returned for ${service.tDtoID}`);
                continue;
            }

            console.log(`\tFetched entities: ${JSON.stringify(existingEntities)}`);

            const linkedEntityIdMap = Object.keys(existingEntities).reduce((acc, parentId) => {
                const entityList = existingEntities[parentId] || [];
                entityList.forEach((entity) => {
                    const linkedEntityIdKey = Object.keys(entity).find((key) => /^entity_.*_id$/.test(key));
                    if (linkedEntityIdKey) {
                        acc[parentId] = acc[parentId] || { parentId, entityId: [], childMapKey: mappingMappedKey, mapKey: entity["entity_type"] };
                        acc[parentId].entityId.push(entity[linkedEntityIdKey]);
                    }
                });
                return acc;
            }, {} as Record<string, { parentId: string; entityId: string[]; mapKey: string; childMapKey: string }>);

            entities.forEach((entity) => {
                const id = entity[identifierKey] as string;
                if (existingEntities[id]) {
                    entity[mappingMappedKey] = existingEntities[id].map((result) => result[mapKey]);
                }
            });

            await Promise.all(
                Object.values(linkedEntityIdMap).map(async (linkedEntity) => {
                    if (linkedEntity.entityId.length > 0) {
                        const childEntities = await Promise.all(
                            linkedEntity.entityId
                                .filter((linkedId) => {
                                    const key = `${linkedEntity.parentId}-${linkedId}`;
                                    if (processedEntities.has(key)) {
                                        return false; // Skip already processed entities
                                    }
                                    processedEntities.add(key);
                                    return true;
                                })
                                .map((linkedId) =>
                                    this.fetchAndMap(
                                        (existingEntities[linkedEntity.parentId] || []).map((entity) => ({
                                            ...entity[linkedEntity.childMapKey],
                                            entity_key: linkedId,
                                        })) as TDto[],
                                        "entity_key" as keyof TDto,
                                        `entity_${linkedEntity.childMapKey}`
                                    )
                                )
                        );
                        entities.forEach((entity) => {
                            if (entity[identifierKey] === linkedEntity.parentId) {
                                entity[linkedEntity.childMapKey] = childEntities.flat();
                            }
                        });
                    }
                })
            );
        } catch (error) {
            console.error(`Error processing mapping for ${mapKey as string}:`, error);
        }
    }

    console.log(`Final mapped entities: ${JSON.stringify(entities)}`);
    return entities;
}

protected async fetchAndMapa(
    entities: TDto[],
    identifierKey: keyof TDto,
    entityAuxType: any = null
): Promise<TDto[]> {
    console.log(`entities: ${JSON.stringify(entities)}`);
    console.log(`identifierKey: ${identifierKey as string}`);
    console.log(`entityAuxType: ${entityAuxType}`);

    const entityIds = Array.from(
        new Set(entities.map((entity) => entity[identifierKey] as string))
    );

    // process each mapping to fetch top-level and linked child entities
    await Promise.all(
        this.mappings.map(async ({ service, entityType, mapKey }) => {
            const mappingMappedKey = `${mapKey as string}`;

            console.log(`\tservice: ${service.tDtoID}`); // the identifier for the service (i.e. media_id is for the media service)
            console.log(`\tentityType: ${entityType}`);
            console.log(`\tmapKey: ${mapKey as string}`);

            // fetch top-level entities for the current mapping
            const existingEntities = await service.fetchByEntityIDs(entityIds, entityAuxType || entityType);

            console.log(`\texistingEntities: ${JSON.stringify(existingEntities)}`);

            if (!existingEntities) return;

            // map linked entity IDs
            const linkedEntityIdMap = Object.keys(existingEntities).reduce((acc, parentId) => {
                const entityList = existingEntities[parentId] || [];
                console.log(`\t\tentityList: ${JSON.stringify(entityList)}`);

                entityList.forEach((entity) => {
                    const linkedEntityIdKey = Object.keys(entity).find((key) =>
                        /^entity_.*_id$/.test(key)
                    );

                    console.log(`\t\tlinkedEntityIdKey: ${linkedEntityIdKey}`);

                    if (linkedEntityIdKey) {
                        acc[parentId] = acc[parentId] || {
                            parentId,
                            entityId: [],
                            childMapKey: mappingMappedKey,
                            mapKey: entity['entity_type'],
                        };
                        acc[parentId].entityId.push(entity[linkedEntityIdKey]);
                    }
                });
                return acc;
            }, {} as Record<string, { parentId: string; entityId: string[]; mapKey: string; childMapKey: string }>);

            console.log(`\t\t\tlinkedEntityIdMap: ${JSON.stringify(linkedEntityIdMap)}`);

            // map top-level results to the entities
            entities.forEach((entity) => {
                const id = entity[identifierKey] as string;
                if (existingEntities[id]) {
                    entity[mappingMappedKey] = existingEntities[id].map((result) => result[mapKey]);
                }
            });

            console.log(`\t\t\tentities: ${JSON.stringify(entities)}`);

            // recursively fetch child entities
            await Promise.all(
                Object.values(linkedEntityIdMap).map(async (linkedEntity) => {
                    console.log(`\t\t\t\tlinkedEntity: ${JSON.stringify(linkedEntity)}`);

                    if (linkedEntity["entityId"].length > 0) {
                        const childEntities = await Promise.all(
                            linkedEntity["entityId"].map((linkedId) =>
                                this.fetchAndMap(
                                    existingEntities[linkedEntity.parentId].map((entity) => ({
                                        // ...entity,
                                        ...entity[linkedEntity["childMapKey"]],
                                        [`entity_key`]: linkedId,
                                    })) as TDto[],
                                    `entity_key` as keyof TDto,
                                    `entity_${linkedEntity["childMapKey"]}`
                                )
                            )
                        );

                        console.log(`\t\t\t\tchildEntities: ${JSON.stringify(childEntities)}`);

                        // attach child entities to the parent
                        entities.forEach((entity) => {
                            const id = entity[identifierKey] as string;
                            if (id === linkedEntity.parentId) {
                                entity[linkedEntity.childMapKey] = childEntities.flat();
                            }
                        });

                        console.log(`\t\t\t\tentities: ${JSON.stringify(entities)}`);
                    }
                })
            );
        })
    );

    // console.log(`Final mapped entities: ${JSON.stringify(entities)}`);
    return entities;
}

    /**
     * Recursively fetches and maps data based on entity relationships.
     * @param entities The initial entities to map.
     * @param identifierKey The key used to identify entities.
     * @param entityChildAuxKey Auxiliary key for nested relationships.
     */
    async fetchAndMapOLD(
        entities: any[],
        identifierKey: string,
        entityChildAuxKey: string | null = null
    ): Promise<any[]> {
        const results: any[] = [];

        for (const mapItem of this.mappings) {
            const { service, entityType, mapKey } = mapItem;
            const entityServiceType = entityType;

            // Extract the entity IDs from the entities array
            const entityIDs = entities.map((entity) => entity[identifierKey]);

            // Fetch related data
            const fetchResult = await service.fetchByEntityIDs(entityIDs, entityChildAuxKey || entityServiceType);

            if (!fetchResult) return;

            console.log(`fetchResult: ${JSON.stringify(fetchResult)}`)

            // Map the fetched data back to the entities
            for (const entity of entities) {
                const relatedData = fetchResult[entity[identifierKey]] || [];
                entity[mapKey] = relatedData;

                // Check if there's a need to recursively fetch child relationships
                if (relatedData.length > 0) {

                    const childIdentifierKey = Object.keys(entity).find((key) => /^entity_.*_id$/.test(key));
                    // const childIdentifierKey = `entity_${mapKey as string}_id`; // e.g., entity_amenities_id
                    const childAuxKey = `entity_${mapKey as string}`; // e.g., entity_amenities
                    entity[mapKey] = await this.fetchAndMap(relatedData, childIdentifierKey, childAuxKey);
                }
            }

            results.push(...entities);
        }

        return results;
    }
