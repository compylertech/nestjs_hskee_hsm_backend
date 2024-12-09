import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

// services
import { AddressService } from './address.service';

// contracts
import { CreateAddressDto, UpdateAddressDto, ADDRESS_PATTERN } from '@app/contracts';
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

  @MessagePattern(ADDRESS_PATTERN.UPDATE)
  update(@Payload() updateAddressDto: UpdateAddressDto) {
    try {
      return this.addressService.update(updateAddressDto.address_id, updateAddressDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || `Error updating address with id: ${updateAddressDto.address_id}`,
      });
    }
  }

  @MessagePattern(ADDRESS_PATTERN.REMOVE)
  remove(@Payload() id: string) {
    return this.addressService.remove(id);
  }
}
