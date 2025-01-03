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
  private readonly entityIdKey = 'amenity_id';

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
          entityType: EntityMediaTypeEnum.AMENITIES,
          mapKey: 'media',
        }
      ]
    );
  }

  async create(createAmenitiesDto: CreateAmenitiesDto): Promise<ClientAmenitiesDto> {
    const { media, ...createPropertyContract } = createAmenitiesDto;

    // create the entity
    const amenitiesResponse = await this.amenitiesClient
      .send<ClientAmenitiesDto, ClientCreateAmenitiesDto>(AMENITIES_PATTERN.CREATE, createPropertyContract)
      .toPromise();

    const fieldResponses = await this.createEntityFields(amenitiesResponse[this.entityIdKey], createAmenitiesDto);

    // merge all responses
    return { ...amenitiesResponse, ...fieldResponses };
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<ClientAmenitiesDto[]> {
    const amenitiesResponse = await this.amenitiesClient.send<ClientAmenitiesDto[]>(
      AMENITIES_PATTERN.FIND_ALL,
      pageOptionsDto
    ).toPromise();

    const mappedData = await this.fetchAndMap(amenitiesResponse["data"], this.entityIdKey);

    return { ...amenitiesResponse, data: mappedData };
  }

  async findOne(amenityId: string): Promise<ClientAmenitiesDto> {
    const amenityResponse = await this.amenitiesClient
      .send<ClientAmenitiesDto>(AMENITIES_PATTERN.FIND_ONE, amenityId)
      .toPromise();

    const mappedData = await this.fetchAndMap([amenityResponse], this.entityIdKey);

    return { ...mappedData[0] };
  }

  async update(amenityId: string, updatePropertyDto: UpdateAmenitiesDto): Promise<ClientAmenitiesDto> {
    const { media, ...updatePropertyContract } = updatePropertyDto;

    // update amenity details
    const amenitiesResponse = await this.amenitiesClient
      .send<ClientAmenitiesDto, ClientUpdateAmenitiesDto>(
        AMENITIES_PATTERN.UPDATE,
        { [this.entityIdKey]: amenityId, ...updatePropertyContract }
      )
      .toPromise();

    if (media && media.length > 0) {
      const existingMedia = await this.mediaService.fetchByEntityIDs([amenityId], EntityMediaTypeEnum.AMENITIES);
      const existingMediaIds = (existingMedia[amenityId] || []).map((m) => m.media_id);

      const newMedia = media.filter((m) => !m.media_id);
      const mediaToUpdate = media.filter((m) => m.media_id && existingMediaIds.includes(m.media_id));

      const newMediaResponses = await this.mediaService.createAndLinkEntities(amenityId, EntityMediaTypeEnum.AMENITIES, newMedia);
      const updatedMediaResponses = await this.mediaService.updateEntities(mediaToUpdate);

      return { ...amenitiesResponse, media: [...newMediaResponses, ...updatedMediaResponses] };
    }

    return { ...amenitiesResponse, media: [] };
  }

  async remove(amenityId: string): Promise<void> {
    // remove entity-media links
    await this.mediaService.removeEntityLinks(amenityId, EntityMediaTypeEnum.AMENITIES);

    // remove the entity
    await this.amenitiesClient.send<void>(AMENITIES_PATTERN.DELETE, amenityId).toPromise();
  }
}