import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

// constants
import { AUTH_CLIENT } from '../../../common/utils/constants';

// contracts
import {
  ATTENDANCE_LOG_PATTERN,
  AttendanceLogDto as ClientAttendanceLogDto,
  CreateAttendanceLogDto as ClientCreateAttendanceLogDto,
  UpdateAttendanceLogDto as ClientUpdateAttendanceLogDto
} from '@app/contracts';

// dto
import { CreateAttendanceLogDto } from './dto/create-attendance-log.dto';
import { UpdateAttendanceLogDto } from './dto/update-attendance-log.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';


@Injectable()
export class AttendanceLogService {
  constructor(@Inject(AUTH_CLIENT) private readonly attendanceLogClient: ClientProxy) { }

  async create(createAttendanceLogDto: CreateAttendanceLogDto): Promise<ClientAttendanceLogDto> {
    const createAttendanceLog: CreateAttendanceLogDto = { ...createAttendanceLogDto };

    return this.attendanceLogClient.send<ClientAttendanceLogDto, ClientCreateAttendanceLogDto>(
      ATTENDANCE_LOG_PATTERN.CREATE, createAttendanceLog
    ).toPromise();
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<ClientAttendanceLogDto[]> {
    return this.attendanceLogClient.send<ClientAttendanceLogDto[]>(
      ATTENDANCE_LOG_PATTERN.FIND_ALL,
      pageOptionsDto
    ).toPromise();
  }

  async findLastCheckInTime(user_id: string): Promise<ClientAttendanceLogDto> {
    const response = await this.attendanceLogClient
      .send<ClientAttendanceLogDto>(ATTENDANCE_LOG_PATTERN.FIND_LAST_CHECK_IN, user_id)
      .toPromise();

    return response;
  }

  async findOne(attendanceLogId: string): Promise<ClientAttendanceLogDto> {
    return this.attendanceLogClient
      .send<ClientAttendanceLogDto>(ATTENDANCE_LOG_PATTERN.FIND_ONE, attendanceLogId)
      .toPromise();
  }

  async update(attendanceLogId: string, updateAttendanceLogDto: UpdateAttendanceLogDto): Promise<ClientAttendanceLogDto> {
    const updateAttendanceLog: UpdateAttendanceLogDto = { ...updateAttendanceLogDto };

    return this.attendanceLogClient.send<ClientAttendanceLogDto, ClientUpdateAttendanceLogDto>(
      ATTENDANCE_LOG_PATTERN.UPDATE,
      { attendance_log_id: attendanceLogId, ...updateAttendanceLog }
    ).toPromise();
  }

  async remove(attendanceLogId: string): Promise<void> {
    return this.attendanceLogClient.send<void>(
      ATTENDANCE_LOG_PATTERN.REMOVE,
      attendanceLogId
    ).toPromise();
  }
}

