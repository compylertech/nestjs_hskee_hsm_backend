import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

// entity
import { Media } from './entities/media.entity';

// contracts
import { MediaDto, CreateMediaDto, UpdateMediaDto } from '@app/contracts';

// page-meta
import { PageDto } from 'apps/common/dto/page.dto';
import { PageMetaDto } from 'apps/common/dto/page-meta.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

@Injectable()
export class MediaService {
  constructor(@InjectRepository(Media) private mediaRepository: Repository<Media>) { }


  async create(createMediaDto: CreateMediaDto): Promise<Media> {
    const newMedia = this.mediaRepository.create(createMediaDto);

    return this.mediaRepository.save(newMedia);
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

  async update(id: string, updateMediaDto: UpdateMediaDto): Promise<MediaDto> {
    const media = await this.findEntityById(id);

    // merge the updates into the media entity
    const updateMedia = this.mediaRepository.merge(media, updateMediaDto);
    await this.mediaRepository.save(updateMedia);

    return plainToInstance(MediaDto, updateMedia, { excludeExtraneousValues: false });
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
}
