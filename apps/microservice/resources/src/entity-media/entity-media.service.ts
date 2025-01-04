import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

// entity
import { EntityMedia } from './entities/entity-media.entity';

// contracts
import { EntityMediaDto, CreateEntityMediaDto, UpdateEntityMediaDto, EntityMediaTypeEnum } from '@app/contracts';

// pageMeta
import { PageDto } from 'apps/common/dto/page.dto';
import { PageMetaDto } from 'apps/common/dto/page-meta.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

@Injectable()
export class EntityMediaService {
  constructor(@InjectRepository(EntityMedia) private entityMediaRepository: Repository<EntityMedia>) { }


  async create(createEntityMediaDto: CreateEntityMediaDto): Promise<EntityMediaDto> {
    const newEntityMedia = this.entityMediaRepository.create(createEntityMediaDto);

    return this.entityMediaRepository.save(newEntityMedia);
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<EntityMediaDto>> {
    const options = plainToInstance(PageOptionsDto, pageOptionsDto);
    const queryBuilder = this.entityMediaRepository.createQueryBuilder('entityMedia');
    
    queryBuilder
      .orderBy('entityMedia.created_at', pageOptionsDto.order)
      .skip(options.skip)
      .take(options.limit);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: string): Promise<EntityMediaDto> {
    const entityMedia = await this.findEntityById(id);

    return plainToInstance(EntityMediaDto, entityMedia, { excludeExtraneousValues: false });
  }

  async findByEntity(entity_id: string, entity_type: EntityMediaTypeEnum): Promise<EntityMedia[]> {
    return await this.entityMediaRepository.find({
      where: { entity_id, entity_type },
    });
  }

  async update(id: string, updateEntityMediaDto: UpdateEntityMediaDto): Promise<EntityMediaDto> {
    const entityMedia = await this.findEntityById(id);

    // merge the updates into the entityMedia entity
    const updateEntityMedia = this.entityMediaRepository.merge(entityMedia, updateEntityMediaDto);
    await this.entityMediaRepository.save(updateEntityMedia);

    return plainToInstance(EntityMediaDto, updateEntityMedia, { excludeExtraneousValues: false });
  }

  async remove(id: string): Promise<void> {
    const entityMedia = await this.findEntityById(id);
    await this.entityMediaRepository.delete(entityMedia);
  }

  async deleteByEntity(entity_id: string, entity_type: EntityMediaTypeEnum): Promise<void> {
    await this.entityMediaRepository.delete({ entity_id, entity_type });
  }

  private async findEntityById(id: string): Promise<EntityMedia> {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid UUID: ${id}`);
    }

    const entityMedia = await this.entityMediaRepository.findOne({ where: { entity_media_id: id } });

    if (!entityMedia) {
      throw new NotFoundException(`EntityMedia with ID ${id} not found`);
    }

    return entityMedia;
  }
}
