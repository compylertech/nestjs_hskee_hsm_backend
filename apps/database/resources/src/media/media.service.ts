import { In, Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

// entity
import { Media } from './entities/media.entity';
import { EntityMedia } from '../entity-media/entities/entity-media.entity';

// contracts
import { MediaDto, CreateMediaDto, UpdateMediaDto, EntityMediaTypeEnum } from '@app/contracts';

// page-meta
import { PageDto } from 'apps/common/dto/page.dto';
import { PageMetaDto } from 'apps/common/dto/page-meta.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

// external service
import MediaUploaderService from 'apps/common/services/cloudinary/media_uploader';

@Injectable()
export class MediaService {
  private readonly mediaStore = 'media';

  constructor(
    @InjectRepository(Media) private mediaRepository: Repository<Media>,
    @InjectRepository(EntityMedia) private entityMediaRepository: Repository<EntityMedia>
  ) { }

  async create(createMediaDto: CreateMediaDto): Promise<Media> {
    try {
      const mediaInfo = await this.processMedia(createMediaDto);
      const newMedia = this.mediaRepository.create(mediaInfo);

      return this.mediaRepository.save(newMedia);
    } catch (error) {
      throw new BadRequestException(`Error creating media: ${error.message}`);
    }
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<MediaDto>> {
    const options = plainToInstance(PageOptionsDto, pageOptionsDto);
    const queryBuilder = this.mediaRepository.createQueryBuilder('media');

    queryBuilder
      .orderBy('media.created_at', pageOptionsDto.order)
      .skip(options.skip)
      .take(options.limit);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    const transformedEntities = plainToInstance(MediaDto, entities, { excludeExtraneousValues: false });

    return new PageDto(transformedEntities, pageMetaDto);
  }

  async findOne(id: string): Promise<MediaDto> {
    const media = await this.findEntityById(id);

    return plainToInstance(MediaDto, media, { excludeExtraneousValues: false });
  }

  async findByEntity(entity_ids: string[], entity_type: EntityMediaTypeEnum): Promise<any> {
    const media = await this.entityMediaRepository.find({
      where: {
        entity_id: In(entity_ids),
        entity_type: entity_type,
      },
      relations: ['media'],
    });

    const mediaByEntity = media.reduce((acc, curr) => {
      if (!acc[curr.entity_id]) {
        acc[curr.entity_id] = [];
      }
      acc[curr.entity_id].push(curr.media);
      return acc;
    }, {});
    
    return mediaByEntity;
  }

  async update(id: string, updateMediaDto: UpdateMediaDto): Promise<MediaDto> {
    try {
      const media = await this.findEntityById(id);
      const mediaInfo = await this.processMedia(updateMediaDto, media);
      const updatedMedia = this.mediaRepository.merge(media, mediaInfo);
      const savedMedia = await this.mediaRepository.save(updatedMedia);

      return plainToInstance(MediaDto, savedMedia, { excludeExtraneousValues: false });
    } catch (error) {
      throw new BadRequestException(`Error updating media: ${error.message}`);
    }
  }

  async remove(id: string): Promise<void> {
    const media = await this.findEntityById(id);
    await this.mediaRepository.remove(media);
  }

  private async findEntityById(id: string): Promise<Media> {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid UUID: ${id}`);
    }

    const media = await this.mediaRepository.findOne({ where: { media_id: id } });

    if (!media) {
      throw new NotFoundException(`Media with ID ${id} not found`);
    }

    return media;
  }

  private async processMedia(dto: CreateMediaDto | UpdateMediaDto, existingMedia?: Media): Promise<CreateMediaDto | UpdateMediaDto> {
    let mediaInfo = { ...dto };

    if (mediaInfo.content_url) {
      const uploader = new MediaUploaderService(
        mediaInfo.content_url,
        mediaInfo.media_name || existingMedia?.media_name || 'default',
        this.mediaStore
      );

      const uploadResponse = await uploader.upload();
      if (!uploadResponse.success) {
        throw new Error(uploadResponse.error);
      }

      mediaInfo.content_url = uploadResponse.data.contentUrl;
    }

    return mediaInfo;
  }
}