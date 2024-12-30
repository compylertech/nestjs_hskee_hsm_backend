import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

// services
import { PropertyService } from './property.service';

// contracts
import { CreatePropertyDto, UpdatePropertyDto, PROPERTY_PATTERN } from '@app/contracts';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) { }

  @MessagePattern(PROPERTY_PATTERN.CREATE)
  async create(@Payload() createPropertyDto: CreatePropertyDto) {
    try {
      return await this.propertyService.create(createPropertyDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || 'Error creating property!',
      });
    }
  }

  @MessagePattern(PROPERTY_PATTERN.FIND_ALL)
  async findAll(@Payload() pageOptionsDto: PageOptionsDto) {
    try {
      return await this.propertyService.findAll(pageOptionsDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || 'Error fetching property!',
      });
    }
  }

  @MessagePattern(PROPERTY_PATTERN.FIND_ONE)
  async findOne(@Payload() id: string) {
    try {
      return await this.propertyService.findOne(id);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || `Error fetching property with id: ${id}`,
      });
    }
  }

  @MessagePattern(PROPERTY_PATTERN.UPDATE)
  update(@Payload() updatePropertyDto: UpdatePropertyDto) {
    try {
      return this.propertyService.update(updatePropertyDto.property_unit_assoc_id, updatePropertyDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || `Error updating property with id: ${updatePropertyDto.property_unit_assoc_id}`,
      });
    }
  }

  @MessagePattern(PROPERTY_PATTERN.DELETE)
  remove(@Payload() id: string) {
    return this.propertyService.remove(id);
  }
}
