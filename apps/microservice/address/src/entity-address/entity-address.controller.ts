import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

// services
import { EntityAddressService } from './entity-address.service';

// contracts
import { CreateEntityAddressDto, UpdateEntityAddressDto, ENTITY_ADDRESS_PATTERN, EntityAddressTypeEnum } from '@app/contracts';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

@Controller('entityAddress')
export class EntityAddressController {
  constructor(private readonly entityAddressService: EntityAddressService) { }

  @MessagePattern(ENTITY_ADDRESS_PATTERN.CREATE)
  async create(@Payload() createEntityAddressDto: CreateEntityAddressDto) {
    try {
      return await this.entityAddressService.create(createEntityAddressDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || 'Error creating entityAddress!',
      });
    }
  }

  @MessagePattern(ENTITY_ADDRESS_PATTERN.FIND_ALL)
  async findAll(@Payload() pageOptionsDto: PageOptionsDto) {
    try {
      return await this.entityAddressService.findAll(pageOptionsDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || 'Error fetching entityAddress!',
      });
    }
  }

  @MessagePattern(ENTITY_ADDRESS_PATTERN.FIND_ONE)
  async findOne(@Payload() id: string) {
    try {
      return await this.entityAddressService.findOne(id);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || `Error fetching entityAddress with id: ${id}`,
      });
    }
  }

  @MessagePattern(ENTITY_ADDRESS_PATTERN.FIND_BY_ENTITY)
  async findByEntity(@Payload() payload: { entity_id: string; entity_type: string }) {
    const { entity_id, entity_type } = payload;

    try {
      if (Object.values(EntityAddressTypeEnum).includes(entity_type as EntityAddressTypeEnum)) {
        return await this.entityAddressService.findByEntity(entity_id, entity_type as EntityAddressTypeEnum);
      } else {
        console.log(`Invalid entity_type: ${entity_type}`)
      }
      
      return {}
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || `Error fetching entityAddress with id: ${entity_id}`,
      });
    }
  }

  @MessagePattern(ENTITY_ADDRESS_PATTERN.UPDATE)
  async update(@Payload() updateEntityAddressDto: UpdateEntityAddressDto) {
    try {
      return await this.entityAddressService.update(updateEntityAddressDto.entity_address_id, updateEntityAddressDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || `Error updating entityAddress with id: ${updateEntityAddressDto.entity_address_id}`,
      });
    }
  }

  @MessagePattern(ENTITY_ADDRESS_PATTERN.DELETE)
  async remove(@Payload() id: string) {
    await this.entityAddressService.remove(id);
  }

  @MessagePattern(ENTITY_ADDRESS_PATTERN.DELETE_BY_ENTITY)
  async deleteByEntity(@Payload() payload: { entity_id: string; entity_type: string }): Promise<void> {
    const { entity_id, entity_type } = payload;

    if (Object.values(EntityAddressTypeEnum).includes(entity_type as EntityAddressTypeEnum)) {
      await this.entityAddressService.deleteByEntity(entity_id, entity_type as EntityAddressTypeEnum);
      // throw new Error(`Invalid entity_type: ${entity_type}`);
    }
  }
}
