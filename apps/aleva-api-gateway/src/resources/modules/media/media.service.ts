import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

// constants
import { RESOURCE_CLIENT } from '../../../common/utils/constants';

// contracts
import {
  MEDIA_PATTERN,
  MediaDto as ClientMediaDto,
  CreateMediaDto as ClientCreateMediaDto,
  UpdateMediaDto as ClientUpdateMediaDto
} from '@app/contracts';

// dto
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';


@Injectable()
export class MediaService {
  constructor(@Inject(RESOURCE_CLIENT) private readonly mediaClient: ClientProxy) { }

  async create(createMediaDto: CreateMediaDto): Promise<ClientMediaDto> {
    const createMediaContract: CreateMediaDto = { ...createMediaDto };

    return this.mediaClient.send<ClientMediaDto, ClientCreateMediaDto>(
      MEDIA_PATTERN.CREATE, createMediaContract
    ).toPromise();
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<ClientMediaDto[]> {
    return this.mediaClient.send<ClientMediaDto[]>(
      MEDIA_PATTERN.FIND_ALL,
      pageOptionsDto
    ).toPromise();
  }

  async findOne(mediaId: string): Promise<ClientMediaDto> {
    return this.mediaClient
      .send<ClientMediaDto>(MEDIA_PATTERN.FIND_ONE, mediaId)
      .toPromise();
  }

  async update(mediaId: string, updateMediaDto: UpdateMediaDto): Promise<ClientMediaDto> {
    const updateMediaContract: UpdateMediaDto = { ...updateMediaDto };

    return this.mediaClient.send<ClientMediaDto, ClientUpdateMediaDto>(
      MEDIA_PATTERN.UPDATE,
      { media_id: mediaId, ...updateMediaContract }
    ).toPromise();
  }

  async remove(mediaId: string): Promise<void> {
    return this.mediaClient.send<ClientMediaDto>(
      MEDIA_PATTERN.DELETE,
      mediaId
    ).toPromise();
  }
}

