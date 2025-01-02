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
    super(
      'media_id',
      mediaClient,
      {
        ...MEDIA_PATTERN,
        LINK_ENTITY: ENTITY_MEDIA_PATTERN.CREATE,
        DELETE_BY_ENTITY: ENTITY_MEDIA_PATTERN.DELETE_BY_ENTITY
      },
      ClientCreateEntityMediaDto,
      []
    );
  }
}

