import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

// services
import { AmenitiesService } from './amenities.service';

// contracts
import { CreateAmenitiesDto, UpdateAmenitiesDto, AMENITIES_PATTERN } from '@app/contracts';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

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
    try {
      return await this.amenitiesService.findOne(id);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || `Error fetching amenities with id: ${id}`,
      });
    }
  }

  @MessagePattern(AMENITIES_PATTERN.UPDATE)
  update(@Payload() updateAmenitiesDto: UpdateAmenitiesDto) {
    try {
      return this.amenitiesService.update(updateAmenitiesDto.amenity_id, updateAmenitiesDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || `Error updating amenities with id: ${updateAmenitiesDto.amenity_id}`,
      });
    }
  }

  @MessagePattern(AMENITIES_PATTERN.DELETE)
  remove(@Payload() id: string) {
    return this.amenitiesService.remove(id);
  }
}
