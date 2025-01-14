import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Controller, Post, Get, Patch, Delete, Body, Param, Query, HttpCode } from '@nestjs/common';

// services
import { CalendarEventsService } from './calendarevents.service';

// dto
import { CalendarEventDto } from '../../../forms/modules/calendar-event/dto/calendar-event.dto';
import { CreateCalendarEventDto } from '../../../forms/modules/calendar-event/dto/create-calendar-event.dto';
import { UpdateCalendarEventDto } from '../../../forms/modules/calendar-event/dto/update-calendar-event.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

@ApiBearerAuth()
@Controller('calendareventses')
export class CalendarEventsController {
  constructor(private readonly calendareventsService: CalendarEventsService) { }

  @Post()
  @ApiOperation({ summary: 'Create CalendarEvents' })
  @ApiResponse({ status: 200, description: 'Successfully fetched calendareventss.', type: CalendarEventDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async createCalendarEvents(@Body() createCalendarEventsDto: CreateCalendarEventDto) {
    return this.calendareventsService.create(createCalendarEventsDto);
  }

  @Get()
  @ApiOperation({ summary: 'Fetch All CalendarEvents' })
  @ApiResponse({ status: 200, description: 'Successfully fetched calendarevents.', type: CalendarEventDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    let query = await this.calendareventsService.findAll(pageOptionsDto);
    return query;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch Single CalendarEvents' })
  @ApiResponse({ status: 200, description: 'Successfully fetched calendarevents.', type: CalendarEventDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async findOne(@Param('id') id: string) {
    let query = await this.calendareventsService.findOne(id);
    return query;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update CalendarEvents' })
  @ApiResponse({ status: 200, description: 'Successfully fetched calendarevents.', type: CalendarEventDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async update(@Param('id') id: string, @Body() updateCalendarEventsDto: UpdateCalendarEventDto) {
    let query = await this.calendareventsService.update(id, updateCalendarEventsDto);
    return query;
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete CalendarEvents' })
  async remove(@Param('id') calendareventsId: string) {
    await this.calendareventsService.remove(calendareventsId);
  }

}