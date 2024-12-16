import { Controller, Get, Post, Patch, Param, Delete, Body } from '@nestjs/common';

// Services
import { CalendarEventsService } from './calendar-event.service';

// DTOs
import { CreateCalendarEventDto } from './dto/create-calendar-event.dto';
import { UpdateCalendarEventDto } from './dto/update-calendar-event.dto';

@Controller('calendar-events')
export class CalendarEventsController {
  constructor(private calendarEventsService: CalendarEventsService) {}

  @Post()
  create(@Body() createCalendarEventDto: CreateCalendarEventDto) {
    return this.calendarEventsService.create(createCalendarEventDto);
  }

  @Get()
  findAll() {
    return this.calendarEventsService.findAll();
  }

  @Get(':calendar_event_id')
  findOne(@Param('calendar_event_id') calendar_event_id: string) {
    return this.calendarEventsService.findOne(calendar_event_id);
  }

  @Patch(':calendar_event_id')
  update(
    @Param('calendar_event_id') calendar_event_id: string,
    @Body() updateCalendarEventDto: UpdateCalendarEventDto,
  ) {
    return this.calendarEventsService.update(calendar_event_id, updateCalendarEventDto);
  }

  @Delete(':calendar_event_id')
  remove(@Param('calendar_event_id') calendar_event_id: string) {
    return this.calendarEventsService.remove(calendar_event_id);
  }
}
