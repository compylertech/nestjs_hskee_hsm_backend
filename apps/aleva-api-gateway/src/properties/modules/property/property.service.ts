import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

// constants
import { PROPERTIES_CLIENT, RESOURCE_CLIENT } from '../../../common/utils/constants';

// contracts
import {
  PROPERTY_PATTERN,
  PropertyDto as ClientPropertyDto,
  CreatePropertyDto as ClientCreatePropertyDto,
  UpdatePropertyDto as ClientUpdatePropertyDto,

  MEDIA_PATTERN,
  MediaDto as ClientMediaDto,
  CreateMediaDto as ClientCreateMediaDto,
  UpdateMediaDto as ClientUpdateMediaDto,
  
  ENTITY_MEDIA_PATTERN,
  EntityMediaTypeEnum,
  EntityMediaDto as ClientEntityMediaDto,
  CreateEntityMediaDto as ClientCreateEntityMediaDto,
} from '@app/contracts';

// dto
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

@Injectable()
export class PropertyService {
  constructor(
    @Inject(RESOURCE_CLIENT) private readonly resourceClient: ClientProxy,
    @Inject(PROPERTIES_CLIENT) private readonly propertyClient: ClientProxy
  ) { }

  // fetch and map media
  private async fetchAndMapMedia(
    properties: ClientPropertyDto[]
  ): Promise<ClientPropertyDto[]> {
    const propertyIds = properties.map((property) => property.property_unit_assoc_id);

    // fetch all media linked to the properties
    const mediaByProperty = await this.resourceClient
      .send<Record<string, ClientMediaDto[]>>(MEDIA_PATTERN.FIND_BY_ENTITIES, {
        entity_ids: propertyIds,
        entity_type: EntityMediaTypeEnum.PROPERTY,
      })
      .toPromise();

    // map media to their respective properties
    return properties.map((property) => ({
      ...property,
      media: mediaByProperty[property.property_unit_assoc_id] || [],
    }));
  }

  async create(createPropertyDto: CreatePropertyDto): Promise<ClientPropertyDto> {
    const { media, ...createPropertyContract } = createPropertyDto;

    // create the property
    const propertyResponse = await this.propertyClient.send<ClientPropertyDto, ClientCreatePropertyDto>(
      PROPERTY_PATTERN.CREATE,
      createPropertyContract
    ).toPromise();

    // create media and link it to the property
    if (media && media.length > 0) {
      const mediaResponse = await Promise.all(
        media.map((mediaItem) =>
          this.resourceClient
            .send<ClientMediaDto, ClientCreateMediaDto>(MEDIA_PATTERN.CREATE, mediaItem)
            .toPromise()
        )
      );

      const entityMediaLinks = mediaResponse.map((media) => ({
        entity_id: propertyResponse.property_unit_assoc_id,
        media_id: media.media_id,
        entity_type: EntityMediaTypeEnum.PROPERTY,
        media_type: media.media_type,
      }));

      await Promise.all(
        entityMediaLinks.map((link) =>
          this.resourceClient
            .send<ClientEntityMediaDto, ClientCreateEntityMediaDto>(ENTITY_MEDIA_PATTERN.CREATE, link)
            .toPromise()
        )
      );

      return { ...propertyResponse, media: mediaResponse };
    }

    return { ...propertyResponse, media: [] };
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<ClientPropertyDto[]> {
    const properties = await this.propertyClient.send<ClientPropertyDto[]>(
      PROPERTY_PATTERN.FIND_ALL,
      pageOptionsDto
    ).toPromise();

    // fetch media
    return this.fetchAndMapMedia(properties["data"]);
  }

  async findOne(propertyId: string): Promise<ClientPropertyDto> {
    const property = await this.propertyClient
      .send<ClientPropertyDto>(PROPERTY_PATTERN.FIND_ONE, propertyId)
      .toPromise();

    // fetch media
    const propertiesWithMedia = await this.fetchAndMapMedia([property]);

    return propertiesWithMedia[0];
  }

  async update(propertyId: string, updatePropertyDto: UpdatePropertyDto): Promise<ClientPropertyDto> {
    const { media, ...updatePropertyContract } = updatePropertyDto;

    // update property details
    const propertyResponse = await this.propertyClient
      .send<ClientPropertyDto, ClientUpdatePropertyDto>(
        PROPERTY_PATTERN.UPDATE,
        { property_unit_assoc_id: propertyId, ...updatePropertyContract }
      )
      .toPromise();

    if (media && media.length > 0) {
      // fetch existing media
      const existingMedia = await this.resourceClient
        .send<ClientEntityMediaDto[]>(ENTITY_MEDIA_PATTERN.FIND_BY_ENTITY, {
          entity_id: propertyId,
          entity_type: EntityMediaTypeEnum.PROPERTY,
        })
        .toPromise();

      const existingMediaIds = existingMedia.map((em) => em.media_id);

      // separate new and existing media
      const newMedia = media.filter((m) => !m.media_id);
      const existingMediaToUpdate = media.filter((m) => m.media_id && existingMediaIds.includes(m.media_id));

      // create new media
      const newMediaResponses = await Promise.all(
        newMedia.map((mediaItem) =>
          this.resourceClient
            .send<ClientMediaDto, ClientCreateMediaDto>(MEDIA_PATTERN.CREATE, mediaItem)
            .toPromise()
        )
      );

      const newEntityMediaLinks = newMediaResponses.map((newMedia) => ({
        entity_id: propertyId,
        media_id: newMedia.media_id,
        entity_type: EntityMediaTypeEnum.PROPERTY,
        media_type: newMedia.media_type,
      }));

      await Promise.all(
        newEntityMediaLinks.map((link) =>
          this.resourceClient
            .send<ClientEntityMediaDto, ClientCreateEntityMediaDto>(ENTITY_MEDIA_PATTERN.CREATE, link)
            .toPromise()
        )
      );

      // update existing media
      const updatedMediaResponses = await Promise.all(
        existingMediaToUpdate.map((mediaItem) =>
          this.resourceClient
            .send<ClientMediaDto, ClientUpdateMediaDto>(MEDIA_PATTERN.UPDATE, mediaItem)
            .toPromise()
        )
      );

      return { ...propertyResponse, media: [...newMediaResponses, ...updatedMediaResponses] };
    }

    return { ...propertyResponse, media: [] };
  }

  async remove(propertyId: string): Promise<void> {
    // remove entity-media links
    await this.resourceClient
      .send<void>(ENTITY_MEDIA_PATTERN.DELETE_BY_ENTITY, {
        entity_id: propertyId,
        entity_type: EntityMediaTypeEnum.PROPERTY,
      })
      .toPromise();

    // remove the property
    await this.propertyClient.send<void>(PROPERTY_PATTERN.DELETE, propertyId).toPromise();
  }
}
