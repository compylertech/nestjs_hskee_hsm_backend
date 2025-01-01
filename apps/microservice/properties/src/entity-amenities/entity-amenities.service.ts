import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

// entity
import { EntityAmenities } from './entities/entity-amenities.entity';

// contracts
import { EntityAmenitiesDto, CreateEntityAmenitiesDto, UpdateEntityAmenitiesDto } from '@app/contracts';

// page-meta
import { PageDto } from 'apps/common/dto/page.dto';
import { PageMetaDto } from 'apps/common/dto/page-meta.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

@Injectable()
export class EntityAmenitiesService {
  constructor(@InjectRepository(EntityAmenities) private entityAmenitiesRepository: Repository<EntityAmenities>) { }


  async create(createEntityAmenitiesDto: CreateEntityAmenitiesDto): Promise<EntityAmenities> {
    const newEntityAmenities = this.entityAmenitiesRepository.create(createEntityAmenitiesDto);

    return this.entityAmenitiesRepository.save(newEntityAmenities);
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<EntityAmenitiesDto>> {
    const options = plainToInstance(PageOptionsDto, pageOptionsDto);
    const queryBuilder = this.entityAmenitiesRepository.createQueryBuilder('entityAmenities');
    
    queryBuilder
      .orderBy('entityAmenities.created_at', pageOptionsDto.order)
      .skip(options.skip)
      .take(options.limit);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: string): Promise<EntityAmenitiesDto> {
    const entityAmenities = await this.findEntityById(id);

    return plainToInstance(EntityAmenitiesDto, entityAmenities, { excludeExtraneousValues: false });
  }

  async update(id: string, updateEntityAmenitiesDto: UpdateEntityAmenitiesDto): Promise<EntityAmenitiesDto> {
    const entityAmenities = await this.findEntityById(id);

    // merge the updates into the entityAmenities entity
    const updateEntityAmenities = this.entityAmenitiesRepository.merge(entityAmenities, updateEntityAmenitiesDto);
    await this.entityAmenitiesRepository.save(updateEntityAmenities);

    return plainToInstance(EntityAmenitiesDto, updateEntityAmenities, { excludeExtraneousValues: false });
  }

  async remove(id: string): Promise<void> {
    const entityAmenities = await this.findEntityById(id);
    await this.entityAmenitiesRepository.remove(entityAmenities);
  }

  private async findEntityById(id: string): Promise<EntityAmenities> {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid UUID: ${id}`);
    }

    const entityAmenities = await this.entityAmenitiesRepository.findOne({ where: { entity_amenities_id: id } });

    if (!entityAmenities) {
      throw new NotFoundException(`EntityAmenities with ID ${id} not found`);
    }

    return entityAmenities;
  }
}
