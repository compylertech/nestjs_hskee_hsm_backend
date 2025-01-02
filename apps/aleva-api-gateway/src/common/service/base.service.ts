import { ClientProxy } from '@nestjs/microservices';

// meta
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

export abstract class BaseService<
    TDtoTypeEnum,
    TApiCreateDto extends TCreateDto,
    TApiUpdateDto extends TUpdateDto,
    TDto, TCreateDto, TUpdateDto,
    TEntityDto, TEntityCreateDto extends object
> {
    constructor(private readonly tDtoID: string, protected readonly client: ClientProxy, private readonly patterns: any) { }

    async create(createDto: TApiCreateDto): Promise<TDto> {
        const createContract: TApiCreateDto = { ...createDto };

        return await this.client.send<TDto, TCreateDto>(this.patterns.CREATE, createContract).toPromise();
    }

    async findAll(pageOptionsDto: PageOptionsDto): Promise<TDto[]> {
        return await this.client.send<TDto[]>(this.patterns.FIND_ALL, pageOptionsDto).toPromise();
    }

    async findOne(id: string): Promise<TDto> {
        return await this.client.send<TDto>(this.patterns.FIND_ONE, id).toPromise();
    }

    async update(id: string, updateDto: TApiUpdateDto): Promise<TDto> {
        const updateContract: TApiUpdateDto = { ...updateDto };

        return await this.client
            .send<TDto, TUpdateDto>(this.patterns.UPDATE, { [this.tDtoID]: id, ...updateContract })
            .toPromise();
    }

    async remove(id: string): Promise<void> {
        return await this.client.send<void>(this.patterns.DELETE, id).toPromise();
    }

    async fetchByEntityIDs(entityIDs: string[], entityType: TDtoTypeEnum): Promise<Record<string, TDto[]>> {
        return await this.client
            .send<Record<string, TDto[]>>(this.patterns.FIND_BY_ENTITIES, {
                entity_ids: entityIDs,
                entity_type: entityType,
            })
            .toPromise();
    }

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
            entityType
        );

        // ENTITY_PATTERN
        await Promise.all(
            links.map((link) =>
                this.client.send<TEntityDto, TEntityCreateDto>(this.patterns.LINK_ENTITY, link).toPromise()
            )
        );

        return createdEntities;
    }

    private async createEntityLinks<TDto, TEntityDto extends object>(
        responses: TDto[],
        entityId: string,
        entityType: TDtoTypeEnum
    ): Promise<TEntityDto[]> {
        return responses.map((response) => {
            const link = {
                entity_id: entityId,
                entity_type: entityType,
                ...Object.keys(response)
                    .filter((key) => key in ({} as TEntityDto))
                    .reduce((mappedFields, key) => {
                        (mappedFields as any)[key] = (response as any)[key];
                        return mappedFields;
                    }, {}),
            } as TEntityDto;

            return link;
        });
    }

    async updateEntities(entities: TUpdateDto[]): Promise<TDto[]> {
        return await Promise.all(
            entities.map((entity) =>
                this.client.send<TDto, TUpdateDto>(this.patterns.UPDATE, entity).toPromise()
            )
        );
    }

    async removeEntityLinks(entityId: string, entityType: TDtoTypeEnum): Promise<void> {
        // ENTITY_PATTERN
        await this.client
            .send<void>(this.patterns.DELETE_BY_ENTITY, { entity_id: entityId, entity_type: entityType })
            .toPromise();
    }
}
