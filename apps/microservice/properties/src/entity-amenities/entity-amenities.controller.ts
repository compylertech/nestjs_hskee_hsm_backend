import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

// services
import { EntityAmenitiesService } from './entity-amenities.service';

// contracts
import { CreateEntityAmenitiesDto, UpdateEntityAmenitiesDto, ENTITY_AMENITIES_PATTERN, EntityAmenityTypeEnum } from '@app/contracts';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

@Controller('entity-amenities')
export class EntityAmenitiesController {
  constructor(private readonly entityAmenitiesService: EntityAmenitiesService) { }

  @MessagePattern(ENTITY_AMENITIES_PATTERN.CREATE)
  async create(@Payload() createEntityAmenitiesDto: CreateEntityAmenitiesDto) {
    try {
      return await this.entityAmenitiesService.create(createEntityAmenitiesDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || 'Error creating entityAmenities!',
      });
    }
  }

  @MessagePattern(ENTITY_AMENITIES_PATTERN.FIND_ALL)
  async findAll(@Payload() pageOptionsDto: PageOptionsDto) {
    try {
      return await this.entityAmenitiesService.findAll(pageOptionsDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || 'Error fetching entityAmenities!',
      });
    }
  }

  @MessagePattern(ENTITY_AMENITIES_PATTERN.FIND_ONE)
  async findOne(@Payload() id: string) {
    try {
      return await this.entityAmenitiesService.findOne(id);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || `Error fetching entityAmenities with id: ${id}`,
      });
    }
  }

  @MessagePattern(ENTITY_AMENITIES_PATTERN.FIND_BY_ENTITY)
  async findByEntity(@Payload() payload: { entity_id: string; entity_type: string }) {
    const { entity_id, entity_type } = payload;

    try {
      if (!Object.values(EntityAmenityTypeEnum).includes(entity_type as EntityAmenityTypeEnum)) {
        throw new Error(`Invalid entity_type: ${entity_type}`);
      }

      return await this.entityAmenitiesService.findByEntity(entity_id, entity_type as EntityAmenityTypeEnum);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || `Error fetching entityAmenity with id: ${entity_id}`,
      });
    }
  }

  @MessagePattern(ENTITY_AMENITIES_PATTERN.UPDATE)
  async update(@Payload() updateEntityAmenitiesDto: UpdateEntityAmenitiesDto) {
    try {
      return await this.entityAmenitiesService.update(updateEntityAmenitiesDto.entity_amenities_id, updateEntityAmenitiesDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || `Error updating entityAmenities with id: ${updateEntityAmenitiesDto.entity_amenities_id}`,
      });
    }
  }

  @MessagePattern(ENTITY_AMENITIES_PATTERN.DELETE)
  async remove(@Payload() id: string) {
    try {
      await this.entityAmenitiesService.remove(id);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || `Error deleting entityAmenity with id: ${id}`,
      });
    }
  }


  @MessagePattern(ENTITY_AMENITIES_PATTERN.DELETE_BY_ENTITY)
  async deleteByEntity(@Payload() payload: { entity_id: string; entity_type: string }): Promise<void> {
    const { entity_id, entity_type } = payload;

    if (Object.values(EntityAmenityTypeEnum).includes(entity_type as EntityAmenityTypeEnum)) {
      await this.entityAmenitiesService.deleteByEntity(entity_id, entity_type as EntityAmenityTypeEnum);
      // throw new Error(`Invalid entity_type: ${entity_type}`);
    }
  }

}
