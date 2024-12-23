export class CreateCalendarEventDto {
  calendar_event_id: string;
  event_id: string;
  title: string;
  description: string;
  status: string;
  event_type: string;
  event_start_date: string;
  event_end_date: string;
  completed_date: string;
  organizer_id: string;
}
