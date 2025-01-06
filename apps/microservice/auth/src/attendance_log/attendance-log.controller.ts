import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

// services
import { AttendanceLogService } from './attendance-log.service';

// contracts
import { CreateAttendanceLogDto, UpdateAttendanceLogDto, ATTENDANCE_LOG_PATTERN } from '@app/contracts';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

@Controller('attendanceLog')
export class AttendanceLogController {
  constructor(private readonly attendanceLogService: AttendanceLogService) { }

  @MessagePattern(ATTENDANCE_LOG_PATTERN.CREATE)
  async create(@Payload() createAttendanceLogDto: CreateAttendanceLogDto) {
    try {
      return await this.attendanceLogService.create(createAttendanceLogDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || 'Error creating attendanceLog!',
      });
    }
  }

  @MessagePattern(ATTENDANCE_LOG_PATTERN.FIND_ALL)
  async findAll(@Payload() pageOptionsDto: PageOptionsDto) {
    try {
      return await this.attendanceLogService.findAll(pageOptionsDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || 'Error fetching attendanceLog!',
      });
    }
  }

  @MessagePattern(ATTENDANCE_LOG_PATTERN.FIND_ONE)
  async findOne(@Payload() id: string) {
    try {
      return await this.attendanceLogService.findOne(id);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || `Error fetching attendanceLog with id: ${id}`,
      });
    }
  }

  @MessagePattern(ATTENDANCE_LOG_PATTERN.UPDATE)
  update(@Payload() updateAttendanceLogDto: UpdateAttendanceLogDto) {
    try {
      return this.attendanceLogService.update(updateAttendanceLogDto.attendance_log_id, updateAttendanceLogDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || `Error updating attendanceLog with id: ${updateAttendanceLogDto.attendance_log_id}`,
      });
    }
  }

  @MessagePattern(ATTENDANCE_LOG_PATTERN.REMOVE)
  remove(@Payload() id: string) {
    return this.attendanceLogService.remove(id);
  }

  @MessagePattern(ATTENDANCE_LOG_PATTERN.FIND_LAST_CHECK_IN)
  async findLastCheckInTime(@Payload() user_id: string) {
    return await this.attendanceLogService.findLastCheckInTime(user_id);
  }
}
