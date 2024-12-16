import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { map } from 'rxjs';

// Patterns
import { CALENDAR_EVENT_PATTERN } from './dto/calendar-event.pattern';

// DTOs
import { CalendarEventDto } from './dto/calendar-event.dto';
import { CreateCalendarEventDto } from './dto/create-calendar-event.dto';
import { UpdateCalendarEventDto } from './dto/update-calendar-event.dto';

// Constants
const CALENDAR_CLIENT = 'CALENDAR_CLIENT'; 

@Injectable()
export class CalendarEventsService {
  constructor(@Inject(CALENDAR_CLIENT) private calendarClient: ClientProxy) {}

  private mapCalendarEventDto(eventDto: CalendarEventDto): CalendarEventDto {
    return {
      calendar_event_id: eventDto.calendar_event_id,
      event_id: eventDto.event_id,
      title: eventDto.title,
      description: eventDto.description,
      status: eventDto.status,
      event_type: eventDto.event_type,
      event_start_date: eventDto.event_start_date,
      event_end_date: eventDto.event_end_date,
      completed_date: eventDto.completed_date,
      organizer_id: eventDto.organizer_id,
    };
  }

  create(createEventDto: CreateCalendarEventDto) {
    return this.calendarClient
      .send<CalendarEventDto, CreateCalendarEventDto>(
        CALENDAR_EVENT_PATTERN.CREATE,
        createEventDto,
      )
      .pipe(map(this.mapCalendarEventDto));
  }

  findAll() {
    return this.calendarClient.send<CalendarEventDto[]>(
      CALENDAR_EVENT_PATTERN.FIND_ALL,
      {},
    );
  }

  findOne(calendar_event_id: string) {
    return this.calendarClient.send<CalendarEventDto>(
      CALENDAR_EVENT_PATTERN.FIND_ONE,
      { calendar_event_id },
    );
  }

  update(
    calendar_event_id: string,
    updateEventDto: UpdateCalendarEventDto,
  ) {
    return this.calendarClient
      .send<CalendarEventDto, UpdateCalendarEventDto>(
        CALENDAR_EVENT_PATTERN.UPDATE,
        { calendar_event_id, ...updateEventDto },
      )
      .pipe(map(this.mapCalendarEventDto));
  }

  remove(calendar_event_id: string) {
    return this.calendarClient.send<CalendarEventDto>(
      CALENDAR_EVENT_PATTERN.REMOVE,
      { calendar_event_id },
    );
  }
}
