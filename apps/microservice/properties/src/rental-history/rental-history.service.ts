import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

// entity
import { RentalHistory } from './entities/rental-history.entity';

// contracts
import { RentalHistoryDto, CreateRentalHistoryDto, UpdateRentalHistoryDto } from '@app/contracts';

// page-meta
import { PageDto } from 'apps/common/dto/page.dto';
import { PageMetaDto } from 'apps/common/dto/page-meta.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

@Injectable()
export class RentalHistoryService {
  constructor(@InjectRepository(RentalHistory) private rentalHistoryRepository: Repository<RentalHistory>) { }


  async create(createRentalHistoryDto: CreateRentalHistoryDto): Promise<RentalHistoryDto> {
    const newRentalHistory = this.rentalHistoryRepository.create(createRentalHistoryDto);

    return this.rentalHistoryRepository.save(newRentalHistory);
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<RentalHistoryDto>> {
    const options = plainToInstance(PageOptionsDto, pageOptionsDto);
    const queryBuilder = this.rentalHistoryRepository.createQueryBuilder('rentalHistory');
    
    queryBuilder
      .orderBy('rentalHistory.created_at', pageOptionsDto.order)
      .skip(options.skip)
      .take(options.limit);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: string): Promise<RentalHistoryDto> {
    const rentalHistory = await this.findEntityById(id);

    return plainToInstance(RentalHistoryDto, rentalHistory, { excludeExtraneousValues: false });
  }

  async update(id: string, updateRentalHistoryDto: UpdateRentalHistoryDto): Promise<RentalHistoryDto> {
    const rentalHistory = await this.findEntityById(id);

    // merge the updates into the rentalHistory entity
    const updateRentalHistory = this.rentalHistoryRepository.merge(rentalHistory, updateRentalHistoryDto);
    await this.rentalHistoryRepository.save(updateRentalHistory);

    return plainToInstance(RentalHistoryDto, updateRentalHistory, { excludeExtraneousValues: false });
  }

  async remove(id: string): Promise<void> {
    const rentalHistory = await this.findEntityById(id);
    await this.rentalHistoryRepository.remove(rentalHistory);
  }

  private async findEntityById(id: string): Promise<RentalHistory> {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid UUID: ${id}`);
    }

    const rentalHistory = await this.rentalHistoryRepository.findOne({ where: { rental_history_id: id } });

    if (!rentalHistory) {
      throw new NotFoundException(`RentalHistory with ID ${id} not found`);
    }

    return rentalHistory;
  }
}
