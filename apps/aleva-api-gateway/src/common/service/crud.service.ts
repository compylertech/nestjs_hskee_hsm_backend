import { ClientProxy } from "@nestjs/microservices";
import { PageOptionsDto } from "apps/common/dto/page-optional.dto";

type ConsolidatedEntity<TDto, TEntityDto> = {
    created?: TDto;
    linked?: TEntityDto;
  };
  
export abstract class CrudService<
    TDtoTypeEnum,
    TApiCreateDto,
    TApiUpdateDto,
    TDto extends object,
    TCreateDto,
    TUpdateDto
> {
    dtoIdKey: any;
    
    constructor(
        protected readonly client: ClientProxy,
        public readonly patterns: any,
        private readonly mappings: Array<{
            service: CrudService<any, any, any, any, any, any>;
            entityType: TDtoTypeEnum;
            mapKey: keyof TDto;
        }>
    ) {}

    /**
     * Fetches related entities recursively and maps them to the given entities array.
     */
    async fetchAndMapRelatedEntities(
        entities: any[],
        identifierKey: string,
        childKeyPrefix: string | null = null
    ): Promise<TDto[]> {
        for (const { service, entityType, mapKey } of this.mappings) {
            const entityIds = entities.map((entity) => entity[identifierKey]);
            const fetchedData = await service.fetchEntitiesByIds(entityIds, childKeyPrefix || entityType);

            if (fetchedData) {
                for (const entity of entities) {
                    const relatedData = fetchedData[entity[identifierKey]] || [];
                    const childKey = `entity_${String(mapKey)}`;
                    const childIdKey = `${childKey}_id`;

                    const transformedData = relatedData.map((item) => ({
                        [`${childIdKey}`]: item[`${childIdKey}`],
                        entity_type: item.entity_type,
                        entity_id: item.entity_id,
                        ...item[String(mapKey)],
                    }));

                    entity[mapKey] = transformedData;

                    if (relatedData.length > 0) {
                        await this.fetchAndMapRelatedEntities(
                            transformedData,
                            childIdKey,
                            childKey
                        );
                    }
                }
            }
        }

        return entities;
    }
    
    /**
     * Creates an entity and processes related fields.
     */
    async createEntityAndRelatedFields(createDto: TApiCreateDto): Promise<TDto> {
        const entityId = ''; // Generate or retrieve an entity ID
        const parentResponse = await this.client
            .send<TDto>(this.patterns.CREATE, createDto)
            .toPromise();

        return {
            ...parentResponse,
            ...(await this.createEntityFields(entityId, parentResponse)),
        };
    }

    /**
     * Fetches all entities with pagination.
     */
    async findAllEntities(pageOptionsDto: PageOptionsDto): Promise<TDto[]> {
        return this.client.send<TDto[]>(this.patterns.FIND_ALL, pageOptionsDto).toPromise();
    }

    /**
     * Updates an entity and its related fields.
     */
    async updateEntityAndRelatedFields(
        id: string,
        updateDto: TUpdateDto
    ): Promise<TDto> {
        const updateDtoContract = { ...updateDto, id }; // Build the update payload
        const updatedEntity = await this.client
            .send<TDto>(this.patterns.UPDATE, updateDtoContract)
            .toPromise();

        return {
            ...updatedEntity,
            ...(await this.updateEntityFields(id, updateDto)),
        };
    }

    /**
     * Recursively removes an entity and its related links.
     */
    async removeEntityWithLinks(id: string): Promise<void> {
        for (const { service, entityType } of this.mappings) {
            await service.unlinkEntities(id, entityType);
        }
        await this.client.send<void>(this.patterns.DELETE, id).toPromise();
    }

    /**
     * Helper: Creates related fields for an entity, including nested mappings.
     */
    private async createEntityFields<TDto>(
        entityId: string,
        parentResponse: TDto
    ): Promise<Record<string, any[]>> {
        const fieldResponses = await Promise.all(
            this.mappings.map(async ({ mapKey, service, entityType }) => {
                const relatedData = (parentResponse as any)[mapKey] || [];

                if (relatedData.length > 0) {
                    const parentLinkedEntities = await service.createAndLinkRelatedEntities(
                        entityId,
                        entityType,
                        relatedData
                    );

                    const nestedFields = await Promise.all(
                        parentLinkedEntities.map(async ({ created, linked }, index) => {
                            const linkedEntityIdKey = Object.keys(linked).find((key) =>
                                /^entity_.*_id$/.test(key)
                            );

                            const linkedEntityId = linked[linkedEntityIdKey];

                            const childFields = await service.createEntityFields(
                                linkedEntityId,
                                relatedData[index]
                            );

                            return { ...relatedData[index], ...created, ...childFields };
                        })
                    );

                    return { [mapKey]: nestedFields };
                }

                return { [mapKey]: [] };
            })
        );

        return fieldResponses.reduce((acc, response) => ({ ...acc, ...response }), {});
    }

    /**
     * Helper: Updates related fields for an entity.
     */
    private async updateEntityFields<TUpdateDto>(
        entityId: string,
        updateDto: TUpdateDto
    ): Promise<Record<string, any[]>> {
        const updatedFields = await Promise.all(
            this.mappings.map(async ({ mapKey, service, entityType }) => {
                const relatedData = (updateDto as any)[mapKey] || [];
                if (!relatedData.length) return { [mapKey]: [] };

                const existingEntities = (
                    await service.fetchEntitiesByIds([entityId], entityType)
                )[entityId] || [];
                const existingEntityIds = existingEntities.map((e) => e[service.dtoIdKey]);

                const newEntities = relatedData.filter((item) => !item[service.dtoIdKey]);
                const entitiesToUpdate = relatedData.filter(
                    (item) => item[service.dtoIdKey] && existingEntityIds.includes(item[service.dtoIdKey])
                );

                const createdEntities = await service.createAndLinkRelatedEntities(
                    entityId,
                    entityType,
                    newEntities
                );

                const updatedRelatedEntities = await Promise.all(
                    entitiesToUpdate.map(async (entity) => {
                        const nestedFields = await service.updateEntityFields(
                            entity[service.dtoIdKey],
                            entity
                        );
                        return { ...entity, ...nestedFields };
                    })
                );

                return { [mapKey]: [...createdEntities, ...updatedRelatedEntities] };
            })
        );

        return updatedFields.reduce((acc, response) => ({ ...acc, ...response }), {});
    }

    /**
     * Helper: Unlinks entities from related fields.
     */
    private async unlinkEntities(entityId: string, entityType: TDtoTypeEnum): Promise<void> {
        await this.client
            .send<void>(this.patterns.DELETE_BY_ENTITY, { entity_id: entityId, entity_type: entityType })
            .toPromise();
    }

    /**
     * Creates and links related entities, including intermediary mappings.
     */
    async createAndLinkRelatedEntities(
        entityId: string,
        entityType: TDtoTypeEnum,
        entities: TCreateDto[]
    ): Promise<ConsolidatedEntity<TDto, any>[]> {
        const createdEntities = await Promise.all(
            entities.map((entity) =>
                this.client.send<TDto, TCreateDto>(this.patterns.CREATE, entity).toPromise()
            )
        );

        const links = await this.mapFieldsForLinking(createdEntities, entityId, entityType);

        const linkedEntities = await Promise.all(
            links.map((link) =>
                this.client.send<any, any>(this.patterns.LINK_ENTITY, link).toPromise()
            )
        );

        return createdEntities.map((created, index) => ({
            created,
            linked: linkedEntities[index],
        }));
    }

    /**
     * Helper: Maps fields for linking related entities.
     */
    private async mapFieldsForLinking<TDto>(
        responses: TDto[],
        entityId: string,
        entityType: TDtoTypeEnum
    ): Promise<any[]> {
        return responses.map((response) => ({
            entity_id: entityId,
            entity_type: entityType,
            ...response,
        }));
    }

    /**
     * Fetches entities by their IDs and optionally filters by type.
     */
    async fetchEntitiesByIds(
        entityIds: string[],
        entityType: TDtoTypeEnum | undefined = null
    ): Promise<Record<string, TDto[]>> {
        return this.client
            .send<Record<string, TDto[]>>(this.patterns.FIND_BY_ENTITIES, { entity_ids: entityIds, entity_type: entityType })
            .toPromise();
    }
}
