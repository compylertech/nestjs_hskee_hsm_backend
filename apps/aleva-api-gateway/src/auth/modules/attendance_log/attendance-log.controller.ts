import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Controller, Post, Get, Patch, Delete, Body, Param, Query, HttpCode } from '@nestjs/common';

// services
import { AttendanceLogService } from './attendance-log.service';

// dto
import { AttendanceLogDto } from './dto/attendance-log.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';
import { CreateAttendanceLogDto } from './dto/create-attendance-log.dto';
import { UpdateAttendanceLogDto } from './dto/update-attendance-log.dto';

@ApiBearerAuth()
@Controller('attendanceLogs')
export class AttendanceLogController {
  constructor(private readonly attendanceLogService: AttendanceLogService) { }

  @Post()
  @ApiOperation({ summary: 'Create Attendance Log' })
  @ApiResponse({ status: 200, description: 'Successfully fetched attendanceLogs.', type: AttendanceLogDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async createAttendance_log(@Body() createAttendanceLogDto: CreateAttendanceLogDto) {
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
}
