import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

// services
import { EntityMediaService } from './entity-media.service';

// contracts
import { CreateEntityMediaDto, UpdateEntityMediaDto, ENTITY_MEDIA_PATTERN, EntityMediaTypeEnum } from '@app/contracts';

// dto
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

@Controller('entityMedia')
export class EntityMediaController {
  constructor(private readonly entityMediaService: EntityMediaService) { }

  @MessagePattern(ENTITY_MEDIA_PATTERN.CREATE)
  async create(@Payload() createEntityMediaDto: CreateEntityMediaDto) {
    try {
      return await this.entityMediaService.create(createEntityMediaDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || 'Error creating entityMedia!',
      });
    }
  }

  @MessagePattern(ENTITY_MEDIA_PATTERN.FIND_ALL)
  async findAll(@Payload() pageOptionsDto: PageOptionsDto) {
    try {
      return await this.entityMediaService.findAll(pageOptionsDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || 'Error fetching entityMedia!',
      });
    }
  }

  @MessagePattern(ENTITY_MEDIA_PATTERN.FIND_ONE)
  async findOne(@Payload() id: string) {
    try {
      return await this.entityMediaService.findOne(id);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || `Error fetching entityMedia with id: ${id}`,
      });
    }
  }

  @MessagePattern(ENTITY_MEDIA_PATTERN.FIND_BY_ENTITY)
  async findByEntity(@Payload() payload: { entity_id: string; entity_type: string }) {
    const { entity_id, entity_type } = payload;

    try {
      if (Object.values(EntityMediaTypeEnum).includes(entity_type as EntityMediaTypeEnum)) {
        return await this.entityMediaService.findByEntity(entity_id, entity_type as EntityMediaTypeEnum);
      } else {
        console.log(`Invalid entity_type: ${entity_type}`)
      }
      return {}
      
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || `Error fetching entityMedia with id: ${entity_id}`,
      });
    }
  }

  @MessagePattern(ENTITY_MEDIA_PATTERN.UPDATE)
  update(@Payload() updateEntityMediaDto: UpdateEntityMediaDto) {
    try {
      return this.entityMediaService.update(updateEntityMediaDto.entity_media_id, updateEntityMediaDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || `Error updating entityMedia with id: ${updateEntityMediaDto.entity_media_id}`,
      });
    }
  }

  @MessagePattern(ENTITY_MEDIA_PATTERN.DELETE)
  remove(@Payload() id: string) {
    return this.entityMediaService.remove(id);
  }

  @MessagePattern(ENTITY_MEDIA_PATTERN.DELETE_BY_ENTITY)
  async deleteByEntity(@Payload() payload: { entity_id: string; entity_type: string }): Promise<void> {
    const { entity_id, entity_type } = payload;

    if (Object.values(EntityMediaTypeEnum).includes(entity_type as EntityMediaTypeEnum)) {
      await this.entityMediaService.deleteByEntity(entity_id, entity_type as EntityMediaTypeEnum);
    } else {
      console.log(`Invalid entity_type: ${entity_type}`)
      // throw new Error(`Invalid entity_type: ${entity_type}`);
    }


  }
}
