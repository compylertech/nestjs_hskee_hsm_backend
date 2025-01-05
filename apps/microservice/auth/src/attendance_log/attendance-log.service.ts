import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

// entity
import { AttendanceLog } from './entities/attendance-log.entity';

// contracts
import { AttendanceLogDto, CreateAttendanceLogDto, UpdateAttendanceLogDto, UserBaseDto } from '@app/contracts';

// page-meta
import { PageDto } from 'apps/common/dto/page.dto';
import { PageMetaDto } from 'apps/common/dto/page-meta.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

@Injectable()
export class AttendanceLogService {
  constructor(@InjectRepository(AttendanceLog) private attendanceLogRepository: Repository<AttendanceLog>) { }


  async create(createAttendanceLogDto: CreateAttendanceLogDto): Promise<AttendanceLog> {
    const newAttendanceLog = this.attendanceLogRepository.create(createAttendanceLogDto);

    return this.attendanceLogRepository.save(newAttendanceLog);
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<AttendanceLogDto>> {
    const options = plainToInstance(PageOptionsDto, pageOptionsDto);
    const queryBuilder = this.attendanceLogRepository.createQueryBuilder('attendance_log');
    
    queryBuilder
      .orderBy('attendance_log.created_at', pageOptionsDto.order)
      .leftJoin('attendance_log.user', 'user')
      .addSelect([
        'user.user_id',
        'user.first_name',
        'user.last_name',
        'user.gender',
        'user.date_of_birth',
        'user.email',
        'user.phone_number',
        'user.identification_number',
        'user.photo_url',
      ])
      .skip(options.skip)
      .take(options.limit);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    const transformedEntities = plainToInstance(AttendanceLogDto, entities, { excludeExtraneousValues: false });

    return new PageDto(transformedEntities, pageMetaDto);
  }

  async findOne(id: string): Promise<AttendanceLogDto> {
    const attendanceLog = await this.findEntityById(id);

    return plainToInstance(AttendanceLogDto, attendanceLog, { excludeExtraneousValues: false });
  }

  async update(id: string, updateAttendanceLogDto: UpdateAttendanceLogDto): Promise<AttendanceLogDto> {
    const attendanceLog = await this.findEntityById(id);

    // merge the updates into the attendanceLog entity
    const updateAttendanceLog = this.attendanceLogRepository.merge(attendanceLog, updateAttendanceLogDto);
    await this.attendanceLogRepository.save(updateAttendanceLog);

    return plainToInstance(AttendanceLogDto, updateAttendanceLog, { excludeExtraneousValues: false });
  }

  async remove(id: string): Promise<void> {
    const attendanceLog = await this.findEntityById(id);
    await this.attendanceLogRepository.remove(attendanceLog);
  }

  private async findEntityById(id: string): Promise<AttendanceLog> {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid UUID: ${id}`);
    }

    const attendanceLog = await this.attendanceLogRepository.findOne({ 
      where: { attendance_log_id: id },
      relations: ['user']
     });

    if (!attendanceLog) {
      throw new NotFoundException(`AttendanceLog with ID ${id} not found`);
    }

    return attendanceLog;
  }
}
