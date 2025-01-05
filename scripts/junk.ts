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

protected async fetchAndMapss(
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