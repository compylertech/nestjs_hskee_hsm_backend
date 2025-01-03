import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

// constants
import { ADDRESS_CLIENT } from '../../../common/utils/constants';

// contracts
import {
  ADDRESS_PATTERN,
  AddressDto as ClientAddressDto,
  CreateAddressDto as ClientCreateAddressDto,
  UpdateAddressDto as ClientUpdateAddressDto,

  ENTITY_ADDRESS_PATTERN,
  EntityAddressTypeEnum,
  EntityAddressDto as ClientEntityAddressDto,
  CreateEntityAddressDto as ClientCreateEntityAddressDto,
} from '@app/contracts';

// dto
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

// service
import { BaseService } from 'apps/aleva-api-gateway/src/common/service/base.service';


@Injectable()
export class AddressService extends BaseService<
  EntityAddressTypeEnum,
  CreateAddressDto,
  UpdateAddressDto,
  ClientAddressDto,
  ClientCreateAddressDto,
  ClientUpdateAddressDto,
  ClientEntityAddressDto,
  ClientCreateEntityAddressDto
> {
  private readonly entityIdKey = 'address_id';

  constructor(
    @Inject(ADDRESS_CLIENT) addressClient: ClientProxy
  ) {
    super(
      'address_id',
      addressClient,
      {
        ...ADDRESS_PATTERN,
        LINK_ENTITY: ENTITY_ADDRESS_PATTERN.CREATE,
        DELETE_BY_ENTITY: ENTITY_ADDRESS_PATTERN.DELETE_BY_ENTITY
      },
      ClientCreateEntityAddressDto,
      []
    );
  }
}

