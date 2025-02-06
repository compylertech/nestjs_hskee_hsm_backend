import { Repository, In, FindOptionsWhere, DeepPartial } from 'typeorm';
import { isUUID } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';

// DTOs
import { PageDto } from 'apps/common/dto/page.dto';
import { PageMetaDto } from 'apps/common/dto/page-meta.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

export class BaseService<
    TEntity extends TDto, TDto,
    TCreateDto extends DeepPartial<TEntity>,
    TUpdateDto extends DeepPartial<TEntity>
> {
    constructor(
        protected readonly repository: Repository<TEntity>,
        private readonly dtoClass: { new(): TDto },
        private readonly entityAlias: string,
        private readonly defaultWhere?: FindOptionsWhere<TEntity> 
    ) { }

    async create(createDto: TCreateDto): Promise<TEntity> {
        const newEntity = this.repository.create(createDto);

        return await this.repository.save(newEntity);
    }

    async findAll(
        pageOptionsDto: PageOptionsDto,
        where?: FindOptionsWhere<TEntity>
    ): Promise<PageDto<TDto>> {
        const options = plainToInstance(PageOptionsDto, pageOptionsDto);
        const queryBuilder = await this.repository.createQueryBuilder(this.entityAlias);

        // Use method-level `where` or fallback to `defaultWhere`
        if (where) {
            queryBuilder.where(where);
        } else if (this.defaultWhere) {
            queryBuilder.where(this.defaultWhere);
        }

        queryBuilder
            .orderBy(`${this.entityAlias}.created_at`, pageOptionsDto.order)
            .skip(options.skip)
            .take(options.limit);

        const itemCount = await queryBuilder.getCount();
        const { entities } = await queryBuilder.getRawAndEntities();
        const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

        return new PageDto<TDto>(entities, pageMetaDto);
    }

    async findOne(
        id: string,
        where?: FindOptionsWhere<TEntity>
    ): Promise<TDto> {
        
        const entity = await this.findEntityById(id, where ? where : this.defaultWhere);
        return plainToInstance(this.dtoClass, entity, { excludeExtraneousValues: false });
    }

    async update(
        id: string,
        updateDto: TUpdateDto,
        where?: FindOptionsWhere<TEntity>
    ): Promise<TDto> {
        const entity = await this.findEntityById(id, where ? where : this.defaultWhere);

        const updatedEntity = await this.repository.merge(entity, updateDto);
        await this.repository.save(updatedEntity);

        return plainToInstance(this.dtoClass, updatedEntity, { excludeExtraneousValues: false });
    }

    async remove(
        id: string,
        where?: FindOptionsWhere<TEntity>
    ): Promise<void> {
        const entity = await this.findEntityById(id, where ? where : this.defaultWhere);
        await this.repository.remove(entity);
    }

    async findByEntity(
        entityIds: string[],
        entityType?: string
    ): Promise<Record<string, TEntity[]>> {
        throw new InternalServerErrorException(
            'findByEntity must be implemented in a derived class.'
        );
    }

    protected async findEntityById(
        id: string,
        where?: FindOptionsWhere<TEntity>
    ): Promise<TEntity> {
        if (!isUUID(id)) {
            throw new BadRequestException(`Invalid UUID: ${id}`);
        }

        const findConditions: FindOptionsWhere<TEntity> = {
            id,
            ...(where ? where : this.defaultWhere)
        };

        const entity = await this.repository.findOne({ where: findConditions });

        if (!entity) {
            throw new NotFoundException(`Entity with ID ${id} not found`);
        }

        return entity;
    }
}
