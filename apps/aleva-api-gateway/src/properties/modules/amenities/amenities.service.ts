import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

// constants
import { PROPERTIES_CLIENT } from '../../../common/utils/constants';

// contracts
import {
  EntityMediaTypeEnum,
  EntityAmenityTypeEnum,

  AMENITIES_PATTERN,
  AmenitiesDto as ClientAmenitiesDto,
  CreateAmenitiesDto as ClientCreateAmenitiesDto,
  UpdateAmenitiesDto as ClientUpdateAmenitiesDto,

  ENTITY_AMENITIES_PATTERN,
  EntityAmenitiesDto as ClientEntityAmenitiesDto,
  CreateEntityAmenitiesDto as ClientCreateEntityAmenitiesDto,
} from '@app/contracts';

// dto
import { CreateAmenitiesDto } from './dto/create-amenities.dto';
import { UpdateAmenitiesDto } from './dto/update-amenities.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

// service
import { CrudService } from 'apps/aleva-api-gateway/src/common/service/crud-impl.service';
import { BaseService } from 'apps/aleva-api-gateway/src/common/service/base-impl-crud.service';
import { MediaService } from 'apps/aleva-api-gateway/src/resources/modules/media/media.service';

@Injectable()
export class AmenitiesService extends BaseService<
  EntityAmenityTypeEnum | EntityMediaTypeEnum,
  CreateAmenitiesDto,
  UpdateAmenitiesDto,
  ClientAmenitiesDto,
  ClientCreateAmenitiesDto,
  ClientUpdateAmenitiesDto,
  ClientEntityAmenitiesDto,
  ClientCreateEntityAmenitiesDto
> {

  constructor(
    private readonly mediaService: MediaService,
    @Inject(PROPERTIES_CLIENT) private readonly amenitiesClient: ClientProxy,
  ) {
    const entityIdKey: string = 'amenity_id';

    super(
      entityIdKey,
      amenitiesClient,
      new CrudService(
        entityIdKey,
        amenitiesClient,
        {
          ...AMENITIES_PATTERN,
          LINK_ENTITY: ENTITY_AMENITIES_PATTERN.CREATE,
          DELETE_BY_ENTITY: ENTITY_AMENITIES_PATTERN.DELETE_BY_ENTITY
        },
        ClientCreateEntityAmenitiesDto,
        [
          {
            service: mediaService.crudService,
            entityType: EntityMediaTypeEnum.AMENITIES,
            mapKey: 'media',
          }
        ]
      )
    );
  }
}