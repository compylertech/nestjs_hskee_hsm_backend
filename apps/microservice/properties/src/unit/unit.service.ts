import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

// entity
import { Unit } from './entities/unit.entity';

// contracts
import { UnitDto, CreateUnitDto, UpdateUnitDto } from '@app/contracts';

// page-meta
import { PageDto } from 'apps/common/dto/page.dto';
import { PageMetaDto } from 'apps/common/dto/page-meta.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

@Injectable()
export class UnitService {
  constructor(@InjectRepository(Unit) private unitRepository: Repository<Unit>) { }

  async create(createUnitDto: CreateUnitDto): Promise<UnitDto> {
    // create unit record
    const newUnit = this.unitRepository.create({
      ...createUnitDto
    });

    const savedEntity = await this.unitRepository.save(newUnit);

    return plainToInstance(UnitDto, savedEntity, { excludeExtraneousValues: false });
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<UnitDto>> {
    const options = plainToInstance(PageOptionsDto, pageOptionsDto);
    const queryBuilder = this.unitRepository.createQueryBuilder('unit');
    
    queryBuilder
      .orderBy('unit.created_at', pageOptionsDto.order)
      .skip(options.skip)
      .take(options.limit);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    const transformedEntities = plainToInstance(UnitDto, entities, { excludeExtraneousValues: false });

    return new PageDto(transformedEntities, pageMetaDto);
  }

  async findOne(id: string): Promise<UnitDto> {
    const unit = await this.findEntityById(id);

    return plainToInstance(UnitDto, unit, { excludeExtraneousValues: false });
  }

  async update(id: string, updateUnitDto: UpdateUnitDto): Promise<UnitDto> {
    const unit = await this.findEntityById(id);

    // merge the updates into the unit entity
    const updateUnit = this.unitRepository.merge(unit, updateUnitDto);
    await this.unitRepository.save(updateUnit);

    return plainToInstance(UnitDto, updateUnit, { excludeExtraneousValues: false });
  }

  async remove(id: string): Promise<void> {
    const unit = await this.findEntityById(id);
    await this.unitRepository.remove(unit);
  }

  private async findEntityById(id: string): Promise<Unit> {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid UUID: ${id}`);
    }

    const unit = await this.unitRepository.findOne({ where: { property_unit_assoc_id: id } });

    if (!unit) {
      throw new NotFoundException(`Unit with ID ${id} not found`);
    }

    return unit;
  }
}
