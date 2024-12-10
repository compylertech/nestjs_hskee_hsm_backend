import { PartialType } from '@nestjs/mapped-types';
import { CreateCalendarEventDto } from './create-calendarEvent.dto';

export class UpdateCalendarEventDto extends PartialType(CreateCalendarEventDto) {
  calendar_event_id: string;
}
