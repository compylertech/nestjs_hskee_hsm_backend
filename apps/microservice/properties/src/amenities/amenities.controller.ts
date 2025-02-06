import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

// services
import { AmenitiesService } from './amenities.service';

// contracts
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';
import { CreateAmenitiesDto, UpdateAmenitiesDto, AMENITIES_PATTERN } from '@app/contracts';

// enum
import { EntityAmenityTypeEnum } from '@app/contracts/properties/entity-amenities/entity-amenities.enum';

@Controller('amenities')
export class AmenitiesController {
  constructor(private readonly amenitiesService: AmenitiesService) { }

  @MessagePattern(AMENITIES_PATTERN.CREATE)
  async create(@Payload() createAmenitiesDto: CreateAmenitiesDto) {
    try {
      return await this.amenitiesService.create(createAmenitiesDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || 'Error creating amenities!',
      });
    }
  }

  @MessagePattern(AMENITIES_PATTERN.FIND_ALL)
  async findAll(@Payload() pageOptionsDto: PageOptionsDto) {
    try {
      console.log("FINDALL")
      return await this.amenitiesService.findAll(pageOptionsDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || 'Error fetching amenities!',
      });
    }
  }

  @MessagePattern(AMENITIES_PATTERN.FIND_ONE)
  async findOne(@Payload() id: string) {
    console.log("findOne")
    try {
      return await this.amenitiesService.findOne(id);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || `Error fetching amenities with id: ${id}`,
      });
    }
  }

  @MessagePattern(AMENITIES_PATTERN.FIND_BY_ENTITIES)
  async findByEntities(@Payload() payload: { entity_ids: string[]; entity_type: string }) {
    const { entity_ids, entity_type } = payload;
    try {
      if (!Object.values(EntityAmenityTypeEnum).includes(entity_type as EntityAmenityTypeEnum)) {
        return
      }
      
      return await this.amenitiesService.findByEntity(entity_ids, entity_type as EntityAmenityTypeEnum);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || `Error finding amenities info`,
      });
    }
  }

  @MessagePattern(AMENITIES_PATTERN.UPDATE)
  async update(@Payload() updateAmenitiesDto: UpdateAmenitiesDto) {
    try {
      return await this.amenitiesService.update(updateAmenitiesDto.amenity_id, updateAmenitiesDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || `Error updating amenities with id: ${updateAmenitiesDto.amenity_id}`,
      });
    }
  }

  @MessagePattern(AMENITIES_PATTERN.DELETE)
  async remove(@Payload() id: string) {
    try {
      await this.amenitiesService.remove(id);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || `Error deleting amenity with id: ${id}`,
      });
    }
  }
}
