import { ApiProperty } from '@nestjs/swagger';

export class CalendarEventDto {
  @ApiProperty({ description: 'Calendar Event ID', example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  calendar_event_id: string;

  @ApiProperty({ description: 'Event ID', example: 'event-12345' })
  event_id: string;

  @ApiProperty({ description: 'Title of the event', example: 'Team Meeting' })
  title: string;

  @ApiProperty({ description: 'Detailed description of the event', example: 'Monthly team meeting to discuss project updates.' })
  description: string;

  @ApiProperty({ description: 'Status of the event', example: 'Scheduled' })
  status: string;

  @ApiProperty({ description: 'Type of event', example: 'Meeting' })
  event_type: string;

  @ApiProperty({ description: 'Event start date', example: '2023-12-25T09:00:00Z' })
  event_start_date: string;

  @ApiProperty({ description: 'Event end date', example: '2023-12-25T10:00:00Z' })
  event_end_date: string;

  @ApiProperty({ description: 'Date the event was completed', example: '2023-12-25T10:05:00Z', required: false })
  completed_date?: string;

  @ApiProperty({ description: 'ID of the organizer', example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  organizer_id: string;
}
