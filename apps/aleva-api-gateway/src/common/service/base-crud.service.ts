import { ClientProxy } from '@nestjs/microservices';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';
import { CrudService } from './crud.service';

export abstract class BaseCrudService<
    TApiCreateDto,
    TApiUpdateDto,
    TDto extends object,
    TCreateDto,
    TUpdateDto
> {
    constructor(
        private readonly dtoIdKey: string,
        protected readonly client: ClientProxy,
        private readonly crudService: CrudService<any, any, any, TDto, TCreateDto, any>
    ) {}

    /**
     * Creates a new entity, including related fields.
     */
    async create(createDto: TApiCreateDto): Promise<TDto> {
        return this.crudService.createEntityAndRelatedFields(createDto);
    }

    /**
     * Fetches all entities with pagination.
     */
    async findAll(pageOptionsDto: PageOptionsDto): Promise<TDto[]> {
        return this.crudService.findAllEntities(pageOptionsDto);
    }

    /**
     * Fetches a single entity by its ID.
     */
    async findOne(id: string): Promise<TDto> {
        return this.client.send<TDto>(this.crudService.patterns.FIND_ONE, id).toPromise();
    }

    /**
     * Updates an entity, including related fields.
     */
    async update(id: string, updateDto: TApiUpdateDto): Promise<TDto> {
        return this.crudService.updateEntityAndRelatedFields(id, updateDto);
    }

    /**
     * Removes an entity, including its related fields.
     */
    async remove(id: string): Promise<void> {
        return this.crudService.removeEntityWithLinks(id);
    }
}
