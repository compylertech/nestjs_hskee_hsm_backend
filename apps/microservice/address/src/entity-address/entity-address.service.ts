import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

// entity
import { EntityAddress } from './entities/entity-address.entity';

// contracts
import { EntityAddressDto, CreateEntityAddressDto, UpdateEntityAddressDto, EntityAddressTypeEnum } from '@app/contracts';

// page-meta
import { PageDto } from 'apps/common/dto/page.dto';
import { PageMetaDto } from 'apps/common/dto/page-meta.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

@Injectable()
export class EntityAddressService {
  constructor(@InjectRepository(EntityAddress) private entityAddressRepository: Repository<EntityAddress>) { }


  async create(createEntityAddressDto: CreateEntityAddressDto): Promise<EntityAddressDto> {
    const newEntityAddress = this.entityAddressRepository.create(createEntityAddressDto);

    return this.entityAddressRepository.save(newEntityAddress);
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<EntityAddressDto>> {
    const options = plainToInstance(PageOptionsDto, pageOptionsDto);
    const queryBuilder = this.entityAddressRepository.createQueryBuilder('entityAddress');

    queryBuilder
      .orderBy('entityAddress.created_at', pageOptionsDto.order)
      .skip(options.skip)
      .take(options.limit);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: string): Promise<EntityAddressDto> {
    const entityAddress = await this.findEntityById(id);

    return plainToInstance(EntityAddressDto, entityAddress, { excludeExtraneousValues: false });
  }

  async findByEntity(entity_id: string, entity_type: EntityAddressTypeEnum): Promise<EntityAddress[]> {
    return await this.entityAddressRepository.find({
      where: { entity_id, entity_type },
    });
  }

  async update(id: string, updateEntityAddressDto: UpdateEntityAddressDto): Promise<EntityAddressDto> {
    const entityAddress = await this.findEntityById(id);

    // merge the updates into the entityAddress entity
    const updateEntityAddress = this.entityAddressRepository.merge(entityAddress, updateEntityAddressDto);
    await this.entityAddressRepository.save(updateEntityAddress);

    return plainToInstance(EntityAddressDto, updateEntityAddress, { excludeExtraneousValues: false });
  }

  async remove(id: string): Promise<void> {
    const entityAddress = await this.findEntityById(id);
    await this.entityAddressRepository.remove(entityAddress);
  }

  async deleteByEntity(entity_id: string, entity_type: EntityAddressTypeEnum): Promise<void> {
    await this.entityAddressRepository.delete({ entity_id, entity_type });
  }

  private async findEntityById(id: string): Promise<EntityAddress> {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid UUID: ${id}`);
    }

    const entityAddress = await this.entityAddressRepository.findOne({ where: { entity_address_id: id } });

    if (!entityAddress) {
      throw new NotFoundException(`EntityAddress with ID ${id} not found`);
    }

    return entityAddress;
  }
}
