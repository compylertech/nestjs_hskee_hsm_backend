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

  EntityMediaTypeEnum,
} from '@app/contracts';

// dto
import { CreateAmenitiesDto } from './dto/create-amenities.dto';
import { UpdateAmenitiesDto } from './dto/update-amenities.dto';

// services
import { BaseService } from 'apps/aleva-api-gateway/src/common/service/base.service';
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
    super(
      'amenity_id',
      amenitiesClient,
      {
        ...AMENITIES_PATTERN,
        LINK_ENTITY: ENTITY_AMENITIES_PATTERN.CREATE,
        DELETE_BY_ENTITY: ENTITY_AMENITIES_PATTERN.DELETE_BY_ENTITY
      },
      ClientCreateEntityAmenitiesDto,
      [
        {
          service: mediaService,
          entityType: EntityMediaTypeEnum.PROPERTY,
          mapKey: 'media',
        }
      ]
    );
  }

  async create(createAmenitiesDto: CreateAmenitiesDto): Promise<ClientAmenitiesDto> {
    const { media, ...createPropertyContract } = createAmenitiesDto;

    // create the property
    const amenitiesResponse = await this.amenitiesClient
      .send<ClientAmenitiesDto, ClientCreateAmenitiesDto>(AMENITIES_PATTERN.CREATE, createPropertyContract)
      .toPromise();

    const fieldResponses = await this.createEntityFields(amenitiesResponse.amenity_id, createAmenitiesDto);

    // merge all responses
    return { ...amenitiesResponse, ...fieldResponses };
  }
}