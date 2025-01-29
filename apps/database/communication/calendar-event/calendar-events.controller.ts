import { Controller, Get, Post, Put, Delete, Param, Query, Body } from '@nestjs/common';
import { CalendarEventService } from './calendar-event.service';

@Controller('calendar-event')
export class CalendarEventController {
  constructor(private readonly calendarEventService: CalendarEventService) {}

  @Get()
  async getAll(@Query('limit') limit: number, @Query('offset') offset: number) {
    return this.calendarEventService.findAll(limit, offset);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.calendarEventService.findOne(id);
  }

  @Post()
  async create(@Body() data) {
    return this.calendarEventService.create(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data) {
    return this.calendarEventService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.calendarEventService.delete(id);
  }
}
