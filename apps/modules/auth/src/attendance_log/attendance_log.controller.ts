import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

// services
import { Attendance_logService } from './attendance_log.service';

// contracts
import { CreateAttendance_logDto, UpdateAttendance_logDto, ATTENDANCE_LOG_PATTERN } from '@app/contracts';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

@Controller('attendance_log')
export class Attendance_logController {
  constructor(private readonly attendance_logService: Attendance_logService) { }

  @MessagePattern(ATTENDANCE_LOG_PATTERN.CREATE)
  async create(@Payload() createAttendance_logDto: CreateAttendance_logDto) {
    try {
      return await this.attendance_logService.create(createAttendance_logDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || 'Error creating attendance_log!',
      });
    }
  }

  @MessagePattern(ATTENDANCE_LOG_PATTERN.FIND_ALL)
  async findAll(@Payload() pageOptionsDto: PageOptionsDto) {
    try {
      return await this.attendance_logService.findAll(pageOptionsDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || 'Error fetching attendance_log!',
      });
    }
  }

  @MessagePattern(ATTENDANCE_LOG_PATTERN.FIND_ONE)
  async findOne(@Payload() id: string) {
    try {
      return await this.attendance_logService.findOne(id);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || `Error fetching attendance_log with id: ${id}`,
      });
    }
  }

  @MessagePattern(ATTENDANCE_LOG_PATTERN.UPDATE)
  update(@Payload() updateAttendance_logDto: UpdateAttendance_logDto) {
    try {
      return this.attendance_logService.update(updateAttendance_logDto.attendance_log_id, updateAttendance_logDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || `Error updating attendance_log with id: ${updateAttendance_logDto.attendance_log_id}`,
      });
    }
  }

  @MessagePattern(ATTENDANCE_LOG_PATTERN.REMOVE)
  remove(@Payload() id: string) {
    return this.attendance_logService.remove(id);
  }
}
