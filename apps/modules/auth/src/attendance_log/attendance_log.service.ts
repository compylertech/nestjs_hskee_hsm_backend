import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

// entity
import { Attendance_log } from './entities/attendance_log.entity';

// contracts
import { Attendance_logDto, CreateAttendance_logDto, UpdateAttendance_logDto } from '@app/contracts';

// page-meta
import { PageDto } from 'apps/common/dto/page.dto';
import { PageMetaDto } from 'apps/common/dto/page-meta.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

@Injectable()
export class Attendance_logService {
  constructor(@InjectRepository(Attendance_log) private attendance_logRepository: Repository<Attendance_log>) { }


  async create(createAttendance_logDto: CreateAttendance_logDto): Promise<Attendance_log> {
    const newAttendance_log = this.attendance_logRepository.create(createAttendance_logDto);

    return this.attendance_logRepository.save(newAttendance_log);
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<Attendance_logDto>> {
    const options = plainToInstance(PageOptionsDto, pageOptionsDto);
    const queryBuilder = this.attendance_logRepository.createQueryBuilder('attendance_log');
    
    queryBuilder
      .orderBy('attendance_log.created_at', pageOptionsDto.order)
      .skip(options.skip)
      .take(options.limit);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: string): Promise<Attendance_logDto> {
    const attendance_log = await this.findEntityById(id);

    return plainToInstance(Attendance_logDto, attendance_log, { excludeExtraneousValues: false });
  }

  async update(id: string, updateAttendance_logDto: UpdateAttendance_logDto): Promise<Attendance_logDto> {
    const attendance_log = await this.findEntityById(id);

    // merge the updates into the attendance_log entity
    const updateAttendance_log = this.attendance_logRepository.merge(attendance_log, updateAttendance_logDto);
    await this.attendance_logRepository.save(updateAttendance_log);

    return plainToInstance(Attendance_logDto, updateAttendance_log, { excludeExtraneousValues: false });
  }

  async remove(id: string): Promise<void> {
    const attendance_log = await this.findEntityById(id);
    await this.attendance_logRepository.remove(attendance_log);
  }

  private async findEntityById(id: string): Promise<Attendance_log> {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid UUID: ${id}`);
    }

    const attendance_log = await this.attendance_logRepository.findOne({ where: { attendance_log_id: id } });

    if (!attendance_log) {
      throw new NotFoundException(`Attendance_log with ID ${id} not found`);
    }

    return attendance_log;
  }
}
