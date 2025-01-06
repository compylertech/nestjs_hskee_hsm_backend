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
    // private readonly userService: UsersService
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

  @Post('attendance_logs/guest-attendance')
  @ApiOperation({ summary: 'Guest Attendance Log' })
  @ApiResponse({ status: 200, description: 'Successfully fetched attendanceLogs.', type: AttendanceLogDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async guestAttendanceLog(@Body() guestAttendanceLogDto: GuestAttendanceLogDto) {
    // this.userService.findOne()
    // return this.attendanceLogService.create(guestAttendanceLogDto);
  }


  @Post('attendance_logs/guest-attendance/:id')
  @ApiOperation({ summary: 'Guest Attendance Log' })
  @ApiResponse({ status: 200, description: 'Successfully fetched attendanceLogs.', type: AttendanceLogDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async guestAttendanceLogID(@Param('id') id: string, @Body() guestAttendanceLogDto: GuestAttendanceLogDto) {
    // return this.attendanceLogService.create(guestAttendanceLogDto);
  }


}
