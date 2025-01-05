
    // fetch and map respective detail mappings
    protected async fetchAndMapOld(
        entities: TDto[],
        identifierKey: keyof TDto,
        entityAuxType: any = null
    ): Promise<TDto[]> {
        const entityIds = entities.map((entity) => entity[identifierKey] as string);

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
                                        // [{ [identifierKey]: linkedId, ...existingEntities[linkedEntity["parentId"]]}] as TDto[],

                                        // existingEntities[linkedEntity["parentId"]].map((entity) => ({
                                        //     ...entity[linkedEntity["childMapKey"]],
                                        //     [identifierKey]: linkedId,
                                        // })) as TDto[],
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