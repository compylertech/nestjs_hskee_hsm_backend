import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

// constants
import { RESOURCE_CLIENT } from '../../../common/utils/constants';

// contracts
import {
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
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

// service
import { BaseService } from 'apps/aleva-api-gateway/src/common/service/base.service';


@Injectable()
export class MediaService extends BaseService<
  EntityMediaTypeEnum,
  CreateMediaDto,
  UpdateMediaDto,
  ClientMediaDto,
  ClientCreateMediaDto,
  ClientUpdateMediaDto,
  ClientEntityMediaDto,
  ClientCreateEntityMediaDto
> {
  constructor(@Inject(RESOURCE_CLIENT) mediaClient: ClientProxy) {
    super('media_id', mediaClient, { ...MEDIA_PATTERN, LINK_ENTITY: ENTITY_MEDIA_PATTERN.CREATE, DELETE_BY_ENTITY: ENTITY_MEDIA_PATTERN.DELETE_BY_ENTITY });
  }
  // constructor(@Inject(RESOURCE_CLIENT) private readonly mediaClient: ClientProxy) { }

  // async create(createMediaDto: CreateMediaDto): Promise<ClientMediaDto> {
  //   const createMediaContract: CreateMediaDto = { ...createMediaDto };

  //   return await this.mediaClient.send<ClientMediaDto, ClientCreateMediaDto>(
  //     MEDIA_PATTERN.CREATE, createMediaContract
  //   ).toPromise();
  // }

  // async findAll(pageOptionsDto: PageOptionsDto): Promise<ClientMediaDto[]> {
  //   return await this.mediaClient.send<ClientMediaDto[]>(
  //     MEDIA_PATTERN.FIND_ALL,
  //     pageOptionsDto
  //   ).toPromise();
  // }

  // async findOne(mediaId: string): Promise<ClientMediaDto> {
  //   return await this.mediaClient
  //     .send<ClientMediaDto>(MEDIA_PATTERN.FIND_ONE, mediaId)
  //     .toPromise();
  // }

  // async update(mediaId: string, updateMediaDto: UpdateMediaDto): Promise<ClientMediaDto> {
  //   const updateMediaContract: UpdateMediaDto = { ...updateMediaDto };

  //   return await this.mediaClient.send<ClientMediaDto, ClientUpdateMediaDto>(
  //     MEDIA_PATTERN.UPDATE,
  //     { media_id: mediaId, ...updateMediaContract }
  //   ).toPromise();
  // }

  // async remove(mediaId: string): Promise<void> {
  //   await this.mediaClient.send<ClientMediaDto>(
  //     MEDIA_PATTERN.DELETE,
  //     mediaId
  //   ).toPromise();
  // }

  // // fetch media by entity IDs
  // async fetchByEntityIDs(entityIDs: string[], entityType: EntityMediaTypeEnum): Promise<Record<string, ClientMediaDto[]>> {
  //   return await this.mediaClient
  //     .send<Record<string, ClientMediaDto[]>>(MEDIA_PATTERN.FIND_BY_ENTITIES, {
  //       entity_ids: entityIDs,
  //       entity_type: entityType,
  //     })
  //     .toPromise();
  // }

  // // create and link media to a property
  // async createAndLinkMedia(entityId: string, entityType: EntityMediaTypeEnum, media: ClientCreateMediaDto[]): Promise<ClientMediaDto[]> {

  //   // create media
  //   const mediaResponses = await Promise.all(
  //     media.map((mediaItem) =>
  //       this.mediaClient
  //         .send<ClientMediaDto, ClientCreateMediaDto>(MEDIA_PATTERN.CREATE, mediaItem)
  //         .toPromise()
  //     )
  //   );

  //   // create entity media objects
  //   const entityMediaLinks = mediaResponses.map((media) => ({
  //     entity_id: entityId,
  //     media_id: media.media_id,
  //     entity_type: entityType,
  //     media_type: media.media_type,
  //   }));

  //   // link media to an entity
  //   await Promise.all(
  //     entityMediaLinks.map((link) =>
  //       this.mediaClient
  //         .send<ClientEntityMediaDto, ClientCreateEntityMediaDto>(ENTITY_MEDIA_PATTERN.CREATE, link)
  //         .toPromise()
  //     )
  //   );

  //   return mediaResponses;
  // }

  // // update existing media
  // async updateMedia(media: ClientUpdateMediaDto[]): Promise<ClientMediaDto[]> {
  //   return await Promise.all(
  //     media.map((mediaItem) =>
  //       this.mediaClient
  //         .send<ClientMediaDto, ClientUpdateMediaDto>(MEDIA_PATTERN.UPDATE, mediaItem)
  //         .toPromise()
  //     )
  //   );
  // }

  // // remove media links for a property
  // async removeMediaLinks(entityId: string, entityType: EntityMediaTypeEnum): Promise<void> {
  //   await this.mediaClient
  //     .send<void>(ENTITY_MEDIA_PATTERN.DELETE_BY_ENTITY, {
  //       entity_id: entityId,
  //       entity_type: entityType,
  //     })
  //     .toPromise();
  // }
}

