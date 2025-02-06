import { ClientProxy } from '@nestjs/microservices';

// service
import { CrudService } from './crud-impl.service';

// page-meta
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

export abstract class BaseService<
    TDtoTypeEnum, // enums
    TApiCreateDto, // gateway
    TApiUpdateDto, // gateway
    TDto extends object, // contract
    TCreateDto, // contract
    TUpdateDto,  // contract
    TEntityDto,  // entity
    TEntityCreateDto // entityCreate
> {
    crudService: CrudService<TDtoTypeEnum, TApiCreateDto, TApiUpdateDto, TDto, TCreateDto, TUpdateDto, TEntityDto, TEntityCreateDto>;

    constructor(
        private readonly dtoIdKey: string,
        protected readonly client: ClientProxy,
        crudService: CrudService<
            TDtoTypeEnum, // enums
            TApiCreateDto, TApiUpdateDto, // gatewway
            TDto, TCreateDto, TUpdateDto, // contract
            TEntityDto, TEntityCreateDto  // entity
        >
    ) { 
        this.crudService = crudService; 
    }

    /**
     * Creates a new entity, including related fields.
     */
    async create(createDto: TApiCreateDto): Promise<TDto> {
        return await this.crudService.createEntityAndRelatedFields(createDto);
    }

    /**
     * Fetches all entities with pagination.
     */
    async findAll(pageOptionsDto: PageOptionsDto): Promise<TDto[]> {
        return await this.crudService.findAllEntities(pageOptionsDto);
    }

    /**
     * Fetches a single entity by its ID.
     */
    async findOne(id: string, pageOptionsDto: PageOptionsDto = null): Promise<TDto> {
        return await this.crudService.findOneEntity(id, pageOptionsDto);
    }

    /**
     * Updates an entity, including related fields.
     */
    async update(id: string, updateDto: TApiUpdateDto): Promise<TDto> {
        return await this.crudService.updateEntityAndRelatedFields(id, updateDto);
    }

    /**
     * Removes an entity, including its related fields.
     */
    async remove(id: string): Promise<void> {
        await this.crudService.removeEntityFields(id);
    }
}