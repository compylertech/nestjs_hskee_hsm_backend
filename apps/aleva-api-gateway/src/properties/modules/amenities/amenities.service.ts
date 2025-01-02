import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

// constants
import { PROPERTIES_CLIENT } from '../../../common/utils/constants';

// contracts
import {
  AMENITIES_PATTERN,
  AmenitiesDto as ClientAmenitiesDto,
  CreateAmenitiesDto as ClientCreateAmenitiesDto,
  UpdateAmenitiesDto as ClientUpdateAmenitiesDto,
  ENTITY_AMENITIES_PATTERN,
  EntityAmenityTypeEnum,
  EntityAmenitiesDto as ClientEntityAmenitiesDto,
  CreateEntityAmenitiesDto as ClientCreateEntityAmenitiesDto,
} from '@app/contracts';

// dto
import { CreateAmenitiesDto } from './dto/create-amenities.dto';
import { UpdateAmenitiesDto } from './dto/update-amenities.dto';

// services
import { BaseService } from 'apps/aleva-api-gateway/src/common/service/base.service';

@Injectable()
export class AmenitiesService extends BaseService<
  EntityAmenityTypeEnum,
  CreateAmenitiesDto,
  UpdateAmenitiesDto,
  ClientAmenitiesDto,
  ClientCreateAmenitiesDto,
  ClientUpdateAmenitiesDto,
  ClientEntityAmenitiesDto,
  ClientCreateEntityAmenitiesDto
> {
  constructor(@Inject(PROPERTIES_CLIENT) amenitiesClient: ClientProxy) {
    super('amenity_id', amenitiesClient, { ...AMENITIES_PATTERN, LINK_ENTITY: ENTITY_AMENITIES_PATTERN.CREATE, DELETE_BY_ENTITY: ENTITY_AMENITIES_PATTERN.DELETE_BY_ENTITY });
  }
}