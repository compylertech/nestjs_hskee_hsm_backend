import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

// services
import { AddressService } from './address.service';

// contracts
import { CreateAddressDto, UpdateAddressDto, ADDRESS_PATTERN, EntityAddressTypeEnum } from '@app/contracts';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) { }

  @MessagePattern(ADDRESS_PATTERN.CREATE)
  async create(@Payload() createAddressDto: CreateAddressDto) {
    try {
      return await this.addressService.create(createAddressDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || 'Error creating address!',
      });
    }
  }

  @MessagePattern(ADDRESS_PATTERN.FIND_ALL)
  async findAll(@Payload() pageOptionsDto: PageOptionsDto) {
    try {
      return await this.addressService.findAll(pageOptionsDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || 'Error fetching address!',
      });
    }
  }

  @MessagePattern(ADDRESS_PATTERN.FIND_ONE)
  async findOne(@Payload() id: string) {
    try {
      return await this.addressService.findOne(id);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || `Error fetching address with id: ${id}`,
      });
    }
  }

  @MessagePattern(ADDRESS_PATTERN.FIND_BY_ENTITIES)
  async findByEntities(@Payload() payload: { entity_ids: string[]; entity_type: string }) {
    const { entity_ids, entity_type } = payload;

    try {
      return await this.addressService.findByEntity(entity_ids, entity_type as EntityAddressTypeEnum)
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || `Error finding address info`,
      });
    }
  }


  @MessagePattern(ADDRESS_PATTERN.UPDATE)
  async update(@Payload() updateAddressDto: UpdateAddressDto) {
    try {
      return await this.addressService.update(updateAddressDto.address_id, updateAddressDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || `Error updating address with id: ${updateAddressDto.address_id}`,
      });
    }
  }

  @MessagePattern(ADDRESS_PATTERN.REMOVE)
  async remove(@Payload() id: string) {
    await this.addressService.remove(id);
  }
}
