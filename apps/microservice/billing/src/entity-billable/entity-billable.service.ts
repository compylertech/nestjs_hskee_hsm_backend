import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

// entity
import { EntityBillable } from './entities/entity-billable.entity';

// contracts
import { EntityBillableDto, CreateEntityBillableDto, UpdateEntityBillableDto } from '@app/contracts';

// page-meta
import { PageDto } from 'apps/common/dto/page.dto';
import { PageMetaDto } from 'apps/common/dto/page-meta.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

@Injectable()
export class EntityBillableService {
  constructor(@InjectRepository(EntityBillable) private entityBillableRepository: Repository<EntityBillable>) { }


  async create(createEntityBillableDto: CreateEntityBillableDto): Promise<EntityBillable> {
    const newEntityBillable = this.entityBillableRepository.create(createEntityBillableDto);

    return this.entityBillableRepository.save(newEntityBillable);
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<EntityBillableDto>> {
    const options = plainToInstance(PageOptionsDto, pageOptionsDto);
    const queryBuilder = this.entityBillableRepository.createQueryBuilder('entityBillable');
    
    queryBuilder
      .orderBy('entityBillable.created_at', pageOptionsDto.order)
      .skip(options.skip)
      .take(options.limit);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: string): Promise<EntityBillableDto> {
    const entityBillable = await this.findEntityById(id);

    return plainToInstance(EntityBillableDto, entityBillable, { excludeExtraneousValues: false });
  }

  async update(id: string, updateEntityBillableDto: UpdateEntityBillableDto): Promise<EntityBillableDto> {
    const entityBillable = await this.findEntityById(id);

    // merge the updates into the entityBillable entity
    const updateEntityBillable = this.entityBillableRepository.merge(entityBillable, updateEntityBillableDto);
    await this.entityBillableRepository.save(updateEntityBillable);

    return plainToInstance(EntityBillableDto, updateEntityBillable, { excludeExtraneousValues: false });
  }

  async remove(id: string): Promise<void> {
    const entityBillable = await this.findEntityById(id);
    await this.entityBillableRepository.remove(entityBillable);
  }

  private async findEntityById(id: string): Promise<EntityBillable> {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid UUID: ${id}`);
    }

    const entityBillable = await this.entityBillableRepository.findOne({ where: { entity_billable_id: id } });

    if (!entityBillable) {
      throw new NotFoundException(`EntityBillable with ID ${id} not found`);
    }

    return entityBillable;
  }
}
