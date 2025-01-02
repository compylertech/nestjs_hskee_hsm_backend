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

    getDtoKeys(): string[] {
        return this.dtoClass.keys();
    }

    // fetch and map respective detail mappings
    protected async fetchAndMap(
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

    // create and process linked mappings including
    // intermediary table mappings.
    // E.g. property -> media via entity_media
    async createEntityFieldsOld(
        entityId: string,
        fields: Array<{
            field: string;
            data: any[];
            service: any;
            entityType: any;
        }>
    ): Promise<Record<string, any[]>> {
        const fieldResponses: Record<string, any[]> = {};

        for (const handler of fields) {
            if (handler.data && handler.data.length > 0) {
                fieldResponses[handler.field] = await handler.service.createAndLinkEntities(
                    entityId,
                    handler.entityType,
                    handler.data
                );
            } else {
                fieldResponses[handler.field] = [];
            }
        }

        return fieldResponses;
    }

    // async createEntityFields(
    //     propertyResponse: TDto
    //     // entityId: string,
    //     // fields: Array<{
    //     //     field: string;
    //     //     data: any[];
    //     //     service: any;
    //     //     entityType: any;
    //     // }>
    // ): Promise<Record<string, any[]>> {
        // const fieldResponses: Record<string, any[]> = {};
        // const entityId = (propertyResponse as any)[this.tDtoID];

        // for (const handler of this.mappings) {
        //     if (propertyResponse[handler.mapKey] && (propertyResponse as any)[handler.mapKey].length > 0) {
        //         (fieldResponses as any)[handler.mapKey] = await handler.service.createAndLinkEntities(
        //             entityId,
        //             handler.entityType,
        //             (propertyResponse as any)[handler.mapKey]
        //         );
        //     } else {
        //         (fieldResponses as any)[handler.mapKey]  = [];
        //     }
        // }

        // return fieldResponses;
    // }

    async createEntityFields<TDto>(
        entityId: string,
        propertyResponse: TDto
    ): Promise<Record<string, any[]>> {
        // const entityId = (propertyResponse as any)[this.tDtoID];
    
        const fieldResponses = await Promise.all(
            this.mappings.map(async ({ mapKey, service, entityType }) => {
                console.log(`\t entityId: ${entityId as String}`)
                console.log(`\t mapKey: ${mapKey as String}`)
                console.log(`\t entityId: ${entityId as String}`)
                console.log(`\t entityType: ${entityType as String}`)

                const data = (propertyResponse as any)[mapKey] || [];
                // console.log(`\t data: ${JSON.stringify(data)}`)

                if (data && data.length > 0) {
                    const linkedEntities = await service.createAndLinkEntities(
                        entityId,
                        entityType,
                        data
                    );
                    return { [mapKey]: linkedEntities };
                }
                return { [mapKey]: [] };
            })
        );
    
        // Combine all field responses into a single object
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
        console.log(`entityDtoFields: ${entityDtoFields}`)

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
        return await this.client
            .send<Record<string, TDto[]>>(this.patterns.FIND_BY_ENTITIES, {
                entity_ids: entityIDs,
                entity_type: entityType,
            })
            .toPromise();
    }

    // update entities in bulk
    async updateEntities(entities: TUpdateDto[]): Promise<TDto[]> {
        return await Promise.all(
            entities.map((entity) =>
                this.client.send<TDto, TUpdateDto>(this.patterns.UPDATE, entity).toPromise()
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
}
