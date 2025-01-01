import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

// entity
import { Amenities } from './entities/amenities.entity';

// contracts
import { AmenitiesDto, CreateAmenitiesDto, UpdateAmenitiesDto } from '@app/contracts';

// page-meta
import { PageDto } from 'apps/common/dto/page.dto';
import { PageMetaDto } from 'apps/common/dto/page-meta.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

@Injectable()
export class AmenitiesService {
  constructor(@InjectRepository(Amenities) private amenitiesRepository: Repository<Amenities>) { }


  async create(createAmenitiesDto: CreateAmenitiesDto): Promise<Amenities> {
    const newAmenities = this.amenitiesRepository.create(createAmenitiesDto);

    return this.amenitiesRepository.save(newAmenities);
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<AmenitiesDto>> {
    const options = plainToInstance(PageOptionsDto, pageOptionsDto);
    const queryBuilder = this.amenitiesRepository.createQueryBuilder('amenities');
    
    queryBuilder
      .orderBy('amenities.created_at', pageOptionsDto.order)
      .skip(options.skip)
      .take(options.limit);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: string): Promise<AmenitiesDto> {
    const amenities = await this.findEntityById(id);

    return plainToInstance(AmenitiesDto, amenities, { excludeExtraneousValues: false });
  }

  async update(id: string, updateAmenitiesDto: UpdateAmenitiesDto): Promise<AmenitiesDto> {
    const amenities = await this.findEntityById(id);

    // merge the updates into the amenities entity
    const updateAmenities = this.amenitiesRepository.merge(amenities, updateAmenitiesDto);
    await this.amenitiesRepository.save(updateAmenities);

    return plainToInstance(AmenitiesDto, updateAmenities, { excludeExtraneousValues: false });
  }

  async remove(id: string): Promise<void> {
    const amenities = await this.findEntityById(id);
    await this.amenitiesRepository.remove(amenities);
  }

  private async findEntityById(id: string): Promise<Amenities> {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid UUID: ${id}`);
    }

    const amenities = await this.amenitiesRepository.findOne({ where: { amenity_id: id } });

    if (!amenities) {
      throw new NotFoundException(`Amenities with ID ${id} not found`);
    }

    return amenities;
  }
}
