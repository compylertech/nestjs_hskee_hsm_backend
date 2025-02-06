import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

// constants
import { PROPERTIES_CLIENT } from '../../../common/utils/constants';

// contract
import {
  EntityMediaTypeEnum,
  EntityAmenityTypeEnum,

  PROPERTY_PATTERN,
  PropertyDto as ClientPropertyDto,
  CreatePropertyDto as ClientCreatePropertyDto,
  UpdatePropertyDto as ClientUpdatePropertyDto,
  EntityAccountTypeEnum,
  EntityAddressTypeEnum
} from '@app/contracts';

// dto
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

// service
import { AmenitiesService } from '../amenities/amenities.service';
import { MediaService } from 'apps/aleva-api-gateway/src/resources/modules/media/media.service';
import { AccountService } from 'apps/aleva-api-gateway/src/billing/modules/account/account.service';
import { AddressService } from 'apps/aleva-api-gateway/src/address/modules/address/address.service';

// base-service
import { CrudService } from 'apps/aleva-api-gateway/src/common/service/crud-impl.service';
import { BaseService } from 'apps/aleva-api-gateway/src/common/service/base-impl-crud.service';

@Injectable()
export class PropertyService extends BaseService<
  EntityAmenityTypeEnum | EntityMediaTypeEnum | EntityAccountTypeEnum | EntityAddressTypeEnum,
  CreatePropertyDto,
  UpdatePropertyDto,
  ClientPropertyDto,
  ClientCreatePropertyDto,
  ClientUpdatePropertyDto,
  null,
  null
> {
  constructor(
    private readonly mediaService: MediaService,
    private readonly accountService: AccountService,
    private readonly addressService: AddressService,
    private readonly amenityService: AmenitiesService,
    @Inject(PROPERTIES_CLIENT) private readonly propertyClient: ClientProxy
  ) {
    const entityIdKey: string = 'property_unit_assoc_id';

    super(
      entityIdKey,
      propertyClient,
      new CrudService<
        EntityAmenityTypeEnum | EntityMediaTypeEnum | EntityAccountTypeEnum | EntityAddressTypeEnum,
        CreatePropertyDto,
        UpdatePropertyDto,
        ClientPropertyDto,
        ClientCreatePropertyDto,
        ClientUpdatePropertyDto,
        null,
        null>(
          entityIdKey,
          propertyClient,
          {
            ...PROPERTY_PATTERN,
            LINK_ENTITY: '',
            DELETE_BY_ENTITY: ''
          },
          null,
          [
            {
              service: amenityService.crudService,
              entityType: EntityAmenityTypeEnum.PROPERTY,
              mapKey: 'amenities',
            },
            {
              service: mediaService.crudService,
              entityType: EntityMediaTypeEnum.PROPERTY,
              mapKey: 'media',
            },
            {
              service: accountService.crudService,
              entityType: EntityAccountTypeEnum.PROPERTY,
              mapKey: 'account',
            },
            {
              service: addressService.crudService,
              entityType: EntityAddressTypeEnum.PROPERTY,
              mapKey: 'address',
            },
          ]
        )
    );
  }
}