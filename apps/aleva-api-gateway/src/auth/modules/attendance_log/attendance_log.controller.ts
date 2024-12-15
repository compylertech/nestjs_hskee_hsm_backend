import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Controller, Post, Get, Patch, Delete, Body, Param, Query, HttpCode } from '@nestjs/common';

// services
import { Attendance_logService } from './attendance_log.service';

// dto
import { AttendanceLogDto } from './dto/attendance-log.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';
import { CreateAttendanceLogDto } from './dto/create-attendance-log.dto';
import { UpdateAttendanceLogDto } from './dto/update-attendance-log.dto';

@ApiBearerAuth()
@Controller('attendance_loges')
export class Attendance_logController {
  constructor(private readonly attendance_logService: Attendance_logService) { }

  @Post()
  @ApiOperation({ summary: 'Create Attendance_log' })
  @ApiResponse({ status: 200, description: 'Successfully fetched attendance_logs.', type: AttendanceLogDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async createAttendance_log(@Body() createAttendanceLogDto: CreateAttendanceLogDto) {
    return this.attendance_logService.create(createAttendanceLogDto);
  }

  @Get()
  @ApiOperation({ summary: 'Fetch All Attendance_log' })
  @ApiResponse({ status: 200, description: 'Successfully fetched attendance_log.', type: AttendanceLogDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    let query = await this.attendance_logService.findAll(pageOptionsDto);
    return query;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch Single Attendance_log' })
  @ApiResponse({ status: 200, description: 'Successfully fetched attendance_log.', type: AttendanceLogDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async findOne(@Param('id') id: string) {
    let query = await this.attendance_logService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Attendance_log' })
  @ApiResponse({ status: 200, description: 'Successfully fetched attendance_log.', type: AttendanceLogDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async update(@Param('id') id: string, @Body() updateAttendanceLogDto: UpdateAttendanceLogDto) {
    let query = await this.attendance_logService.update(id, updateAttendanceLogDto);
    return query;
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete Attendance_log' })
  async remove(@Param('id') attendance_logId: string) {
    await this.attendance_logService.remove(attendance_logId);
  }
}
