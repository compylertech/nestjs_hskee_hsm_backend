import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

// constants
import { ADDRESS_CLIENT } from '../common/utils/constants';

// contracts
import {
  ADDRESS_PATTERN,
  AddressDto as ClientAddressDto,
  CreateAddressDto as ClientCreateAddressDto,
  UpdateAddressDto as ClientUpdateAddressDto
} from '@app/contracts';

// dto
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';


@Injectable()
export class AddressService {
  constructor(@Inject(ADDRESS_CLIENT) private readonly addressClient: ClientProxy) { }

  async create(createAddressDto: CreateAddressDto): Promise<ClientAddressDto> {
    const createAddressContract: CreateAddressDto = { ...createAddressDto };

    return this.addressClient.send<ClientAddressDto, ClientCreateAddressDto>(
      ADDRESS_PATTERN.CREATE, createAddressContract
    ).toPromise();
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<ClientAddressDto[]> {
    return this.addressClient.send<ClientAddressDto[]>(
      ADDRESS_PATTERN.FIND_ALL,
      pageOptionsDto
    ).toPromise();
  }

  async findOne(addressId: string): Promise<ClientAddressDto> {
    return this.addressClient
      .send<ClientAddressDto>(ADDRESS_PATTERN.FIND_ONE, addressId)
      .toPromise();
  }

  async update(addressId: string, updateAddressDto: UpdateAddressDto): Promise<ClientAddressDto> {
    const updateAddressContract: UpdateAddressDto = { ...updateAddressDto };

    return this.addressClient.send<ClientAddressDto, ClientUpdateAddressDto>(
      ADDRESS_PATTERN.UPDATE,
      { address_id: addressId, ...updateAddressContract }
    ).toPromise();
  }

  async remove(addressId: string): Promise<void> {
    this.addressClient.send<ClientAddressDto>(
      ADDRESS_PATTERN.REMOVE,
      addressId
    ).toPromise();
  }
}

