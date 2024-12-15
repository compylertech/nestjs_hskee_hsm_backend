import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

// constants
import { ATTENDANCE_LOG_CLIENT } from '../common/utils/constants';

// contracts
import {
  ATTENDANCE_LOG_PATTERN,
  Attendance_logDto as ClientAttendance_logDto,
  CreateAttendance_logDto as ClientCreateAttendance_logDto,
  UpdateAttendance_logDto as ClientUpdateAttendance_logDto
} from '@app/contracts';

// dto
import { CreateAttendance_logDto } from './dto/create-attendance_log.dto';
import { UpdateAttendance_logDto } from './dto/update-attendance_log.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';


@Injectable()
export class Attendance_logService {
  constructor(@Inject(ATTENDANCE_LOG_CLIENT) private readonly attendance_logClient: ClientProxy) { }

  async create(createAttendance_logDto: CreateAttendance_logDto): Promise<ClientAttendance_logDto> {
    const createAttendance_logContract: CreateAttendance_logDto = { ...createAttendance_logDto };

    return this.attendance_logClient.send<ClientAttendance_logDto, ClientCreateAttendance_logDto>(
      ATTENDANCE_LOG_PATTERN.CREATE, createAttendance_logContract
    ).toPromise();
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<ClientAttendance_logDto[]> {
    return this.attendance_logClient.send<ClientAttendance_logDto[]>(
      ATTENDANCE_LOG_PATTERN.FIND_ALL,
      pageOptionsDto
    ).toPromise();
  }

  async findOne(attendance_logId: string): Promise<ClientAttendance_logDto> {
    return this.attendance_logClient
      .send<ClientAttendance_logDto>(ATTENDANCE_LOG_PATTERN.FIND_ONE, attendance_logId)
      .toPromise();
  }

  async update(attendance_logId: string, updateAttendance_logDto: UpdateAttendance_logDto): Promise<ClientAttendance_logDto> {
    const updateAttendance_logContract: UpdateAttendance_logDto = { ...updateAttendance_logDto };

    return this.attendance_logClient.send<ClientAttendance_logDto, ClientUpdateAttendance_logDto>(
      ATTENDANCE_LOG_PATTERN.UPDATE,
      { attendance_log_id: attendance_logId, ...updateAttendance_logContract }
    ).toPromise();
  }

  async remove(attendance_logId: string): Promise<void> {
    return this.attendance_logClient.send<ClientAttendance_logDto>(
      ATTENDANCE_LOG_PATTERN.REMOVE,
      attendance_logId
    ).toPromise();
  }
}

