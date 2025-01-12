import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

// services
import { MediaService } from './media.service';

// contracts
import { CreateMediaDto, UpdateMediaDto, MEDIA_PATTERN, EntityMediaTypeEnum } from '@app/contracts';

// dto
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

@Controller('media')
export class MediaController {
  constructor(
    private readonly mediaService: MediaService
  ) { }

  @MessagePattern(MEDIA_PATTERN.CREATE)
  async create(@Payload() createMediaDto: CreateMediaDto) {
    try {
      return await this.mediaService.create(createMediaDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || 'Error creating media!',
      });
    }
  }

  @MessagePattern(MEDIA_PATTERN.FIND_ALL)
  async findAll(@Payload() pageOptionsDto: PageOptionsDto) {
    try {
      return await this.mediaService.findAll(pageOptionsDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || 'Error fetching media!',
      });
    }
  }

  @MessagePattern(MEDIA_PATTERN.FIND_ONE)
  async findOne(@Payload() id: string) {
    try {
      return await this.mediaService.findOne(id);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || `Error fetching media with id: ${id}`,
      });
    }
  }

  @MessagePattern(MEDIA_PATTERN.FIND_BY_ENTITIES)
  async findByEntities(@Payload() payload: { entity_ids: string[]; entity_type: string }) {
    const { entity_ids, entity_type } = payload;
    
    try {

      if (!Object.values(EntityMediaTypeEnum).includes(entity_type as EntityMediaTypeEnum)) {
        return
      }

      return await this.mediaService.findByEntity(entity_ids, entity_type as EntityMediaTypeEnum)
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || `Error finding media info`,
      });
    }
  }

  @MessagePattern(MEDIA_PATTERN.UPDATE)
  async update(@Payload() updateMediaDto: UpdateMediaDto) {
    try {
      return await this.mediaService.update(updateMediaDto.media_id, updateMediaDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || `Error updating media with id: ${updateMediaDto.media_id}`,
      });
    }
  }

  @MessagePattern(MEDIA_PATTERN.DELETE)
  async remove(@Payload() id: string) {
    return await this.mediaService.remove(id);
  }
}
