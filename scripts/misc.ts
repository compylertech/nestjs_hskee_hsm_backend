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

  // media
  MEDIA_PATTERN,
  MediaDto as ClientMediaDto,
  CreateMediaDto as ClientCreateMediaDto,
  UpdateMediaDto as ClientUpdateMediaDto,

  // entity media
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
    @Inject(PROPERTIES_CLIENT) private readonly propertyClient: ClientProxy,
    @Inject(RESOURCE_CLIENT) private readonly resourceClient: ClientProxy
  ) { }

  async create(createPropertyDto: CreatePropertyDto): Promise<ClientPropertyDto> {
    const { media, ...createPropertyContract } = createPropertyDto;

    // create property
    const propertyResponse = await this.propertyClient.send<ClientPropertyDto, ClientCreatePropertyDto>(
      PROPERTY_PATTERN.CREATE, createPropertyContract
    ).toPromise();

    // create media
    const mediaResponse = media
      ? await Promise.all(
        media.map((mediaItem) =>
          this.resourceClient
            .send<ClientMediaDto, ClientCreateMediaDto>(
              MEDIA_PATTERN.CREATE,
              mediaItem
            )
            .toPromise()
        )
      )
      : [];

    // link property to media via entity_media
    const entityMediaLinks = mediaResponse.map((mediaResponse) => ({
      entity_id: propertyResponse.property_unit_assoc_id,
      media_id: mediaResponse.media_id,
      entity_type: EntityMediaTypeEnum.PROPERTY,
      media_type: mediaResponse.media_type
    }));

    await Promise.all(
      entityMediaLinks.map((entityMediaItem) =>
        this.resourceClient
          .send<ClientEntityMediaDto, ClientCreateEntityMediaDto>(
            ENTITY_MEDIA_PATTERN.CREATE,
            entityMediaItem
          )
          .toPromise()
      )
    );

    return {
      ...propertyResponse,
      media: mediaResponse || []
    }
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<ClientPropertyDto[]> {
    const properties = await this.propertyClient.send<ClientPropertyDto[]>(
      PROPERTY_PATTERN.FIND_ALL,
      pageOptionsDto
    ).toPromise();

    // collect all property IDs
    const propertyIds = properties["data"].map((property) => property.property_unit_assoc_id);

    // fetch all media in a single call
    const mediaByProperty = await this.resourceClient
      .send<Record<string, ClientMediaDto[]>>(MEDIA_PATTERN.FIND_BY_ENTITIES, {
        entity_ids: propertyIds,
        entity_type: EntityMediaTypeEnum.PROPERTY,
      })
      .toPromise();

    // map media to properties
    const propertiesWithMedia = properties["data"].map((property) => ({
      ...property,
      media: mediaByProperty[property.property_unit_assoc_id] || [],
    }));

    return propertiesWithMedia
  }

  async findOne(propertyId: string): Promise<ClientPropertyDto> {
    const properties = await this.propertyClient
      .send<ClientPropertyDto>(PROPERTY_PATTERN.FIND_ONE, propertyId)
      .toPromise();

    // fetch all media in a single call
    const mediaByProperty = await this.resourceClient
      .send<Record<string, ClientMediaDto[]>>(MEDIA_PATTERN.FIND_BY_ENTITIES, {
        entity_ids: [propertyId],
        entity_type: EntityMediaTypeEnum.PROPERTY,
      })
      .toPromise();

    // map media to properties
    const propertiesWithMedia = [properties].map((property) => ({
      ...property,
      media: mediaByProperty[property.property_unit_assoc_id] || [],
    }))[0];

    return propertiesWithMedia;
  }

  async update(propertyId: string, updatePropertyDto: UpdatePropertyDto): Promise<ClientPropertyDto> {
    const { media, ...updatePropertyContract } = updatePropertyDto;
    let updatedMediaResponses = []

    // update the property details
    const propertyResponse = await this.propertyClient
      .send<ClientPropertyDto, ClientUpdatePropertyDto>(
        PROPERTY_PATTERN.UPDATE,
        { property_unit_assoc_id: propertyId, ...updatePropertyContract }
      )
      .toPromise();

    if (media && media.length > 0) {
      // fetch existing media for the property
      const existingMedia = await this.resourceClient
        .send<ClientEntityMediaDto[]>(ENTITY_MEDIA_PATTERN.FIND_BY_ENTITY, {
          entity_id: propertyId,
          entity_type: EntityMediaTypeEnum.PROPERTY,
        })
        .toPromise();

      // extract media IDs from existing links
      const existingMediaIds = existingMedia.map((em) => em.media_id);

      // separate new and existing media
      const newMedia = media.filter((m) => !m.media_id);
      const existingMediaToUpdate = media.filter((m) => m.media_id && existingMediaIds.includes(m.media_id));

      // create new media and link them to the property
      let newMediaResponses = await Promise.all(
        newMedia.map((mediaItem) =>
          this.resourceClient
            .send<ClientMediaDto, ClientCreateMediaDto>(
              MEDIA_PATTERN.CREATE,
              mediaItem
            )
            .toPromise()
        )
      );

      const newEntityMediaLinks = newMediaResponses ? newMediaResponses.map((newMediaResponse) => ({
        entity_id: propertyId,
        media_id: newMediaResponse.media_id,
        entity_type: EntityMediaTypeEnum.PROPERTY,
        media_type: newMediaResponse.media_type,
      })) : [];

      await Promise.all(
        newEntityMediaLinks.map((entityMediaLink) =>
          this.resourceClient
            .send<ClientEntityMediaDto, ClientCreateEntityMediaDto>(
              ENTITY_MEDIA_PATTERN.CREATE,
              entityMediaLink
            )
            .toPromise()
        )
      );

      // update existing media
      updatedMediaResponses = await Promise.all(
        existingMediaToUpdate.map((mediaItem) =>
          this.resourceClient
            .send<ClientMediaDto, ClientUpdateMediaDto>(
              MEDIA_PATTERN.UPDATE,
              mediaItem
            )
            .toPromise()
        )
      );

      // delete media that are no longer linked
      // const mediaToDelete = existingMedia
      //   .filter((em) => !media.some((m) => m.media_id === em.media_id))
      //   .map((em) => em.media_id);

      // await Promise.all(
      //   mediaToDelete.map((mediaId) =>
      //     this.resourceClient
      //       .send<void>(MEDIA_PATTERN.DELETE, { media_id: mediaId })
      //       .toPromise()
      //   )
      // );

      return {
        ...propertyResponse,
        media: [...newMediaResponses, ...updatedMediaResponses]
      }
    }

    return {
      ...propertyResponse,
      media: []
    }
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

