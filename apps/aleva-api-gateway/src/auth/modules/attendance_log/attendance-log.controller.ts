import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Controller, Post, Get, Patch, Delete, Body, Param, Query, HttpCode } from '@nestjs/common';

// services
import { AttendanceLogService } from './attendance-log.service';

// dto
import { AttendanceLogDto, GuestAttendanceLogDto } from './dto/attendance-log.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';
import { CreateAttendanceLogDto } from './dto/create-attendance-log.dto';
import { UpdateAttendanceLogDto } from './dto/update-attendance-log.dto';
import { UsersService } from '../users/users.service';

@ApiBearerAuth()
@Controller('attendance-logs')
export class AttendanceLogController {
  constructor(
    private readonly attendanceLogService: AttendanceLogService,
    private readonly userService: UsersService
  ) { }

  @Post()
  @ApiOperation({ summary: 'Create Attendance Log' })
  @ApiResponse({ status: 200, description: 'Successfully fetched attendanceLogs.', type: AttendanceLogDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async createAttendanceLog(@Body() createAttendanceLogDto: CreateAttendanceLogDto) {
    return this.attendanceLogService.create(createAttendanceLogDto);
  }

  @Get()
  @ApiOperation({ summary: 'Fetch All Attendance Log' })
  @ApiResponse({ status: 200, description: 'Successfully fetched attendanceLog.', type: AttendanceLogDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    let query = await this.attendanceLogService.findAll(pageOptionsDto);
    return query;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch Single Attendance Log' })
  @ApiResponse({ status: 200, description: 'Successfully fetched attendanceLog.', type: AttendanceLogDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async findOne(@Param('id') id: string) {
    let query = await this.attendanceLogService.findOne(id);
    return query;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Attendance Log' })
  @ApiResponse({ status: 200, description: 'Successfully fetched attendanceLog.', type: AttendanceLogDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async update(@Param('id') id: string, @Body() updateAttendanceLogDto: UpdateAttendanceLogDto) {
    let query = await this.attendanceLogService.update(id, updateAttendanceLogDto);
    return query;
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete Attendance Log' })
  async remove(@Param('id') attendanceLog_id: string) {
    await this.attendanceLogService.remove(attendanceLog_id);
  }

  @Get('guest-attendance/:id')
  @ApiOperation({ summary: 'Guest Attendance Log' })
  @ApiResponse({ status: 200, description: 'Successfully fetched attendanceLogs.', type: AttendanceLogDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async getGuestAttendanceLog(@Param('id') id: string) {
    try {
      // find the user
      const user = await this.userService.findOne(id);

      if (!user) {
        return {
          message: 'User not found',
          email: null,
        };
      }

      // find the last check-in time
      const lastAttendanceLog = await this.attendanceLogService.findLastCheckInTime(user.user_id);

      if (!lastAttendanceLog) {
        // no check-in exists, create a new attendance log
        const newAttendanceLog = await this.createAttendanceLog({
          user_id: user.user_id,
          check_in_time: new Date(),
        });

        return {
          message: 'No previous attendance log found. A new log has been created.',
          attendanceLog: newAttendanceLog,
        };
      }

      // check if the last check-in log has a check-out time
      if (lastAttendanceLog.check_out_time) {
        const checkoutTime = new Date(lastAttendanceLog.check_out_time);
        const today = new Date();
        const isCheckoutYesterday =
          checkoutTime.toDateString() !== today.toDateString() &&
          checkoutTime < today;

        if (isCheckoutYesterday) {
          // if the checkout time is from yesterday, create a new attendance log
          const newAttendanceLog = await this.createAttendanceLog({
            user_id: user.user_id,
            check_in_time: new Date(),
          });

          return {
            message: 'Checkout was from yesterday. A new attendance log has been created.',
            attendanceLog: newAttendanceLog,
          };
        }

        return {
          message: 'Attendance log is up-to-date.',
          attendanceLog: lastAttendanceLog,
        };
      }

      // if no check-out time exists, update the log with the check-out time
      const updatedAttendanceLog = await this.update(lastAttendanceLog.attendance_log_id, {
        user_id: user.user_id,
        check_out_time: new Date(),
      });

      return {
        message: 'Attendance log successfully updated with check-out time.',
        attendanceLog: updatedAttendanceLog,
      };
    } catch (error) {
      console.error('Error processing attendance log:', error);
      throw new Error('Failed to process attendance log.');
    }
  }

  @Post('guest-attendance')
  @ApiOperation({ summary: 'Guest Attendance Log' })
  @ApiResponse({ status: 200, description: 'Successfully fetched attendanceLogs.', type: AttendanceLogDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async guestAttendanceLog(@Body() guestAttendanceLogDto: GuestAttendanceLogDto) {
    try {
      const user = await this.userService.findByEmail(guestAttendanceLogDto.email);

      if (!user) {
        return {
          message: 'User not found',
          email: guestAttendanceLogDto.email,
        };
      }

      if (user && guestAttendanceLogDto.attendance_type == "check_in") {
        const attendanceLog = await this.createAttendanceLog({
          user_id: user.user_id,
          check_in_time: new Date()
        });

        return {
          message: 'Attendance log successfully created',
          attendanceLog,
        };
      }

      if (guestAttendanceLogDto.attendance_type == "check_out") {
        const attendanceLog = await this.attendanceLogService.findLastCheckInTime(user.user_id);

        await this.update(attendanceLog.attendance_log_id, {
          user_id: user.user_id,
          check_out_time: new Date()
        });

        return {
          message: 'Attendance log successfully created',
          attendanceLog,
        };
      }

    } catch (error) {
      console.error('Error creating attendance log:', error);
      throw new Error('Failed to create attendance log');
    }
  }

  @Post('guest-attendance/:id')
  @ApiOperation({ summary: 'Guest Attendance Log' })
  @ApiResponse({ status: 200, description: 'Successfully fetched attendanceLogs.', type: AttendanceLogDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async guestAttendanceLogID(@Param('id') id: string, @Body() guestAttendanceLogDto: GuestAttendanceLogDto) {
    return this.guestAttendanceLog(guestAttendanceLogDto);
  }

}
