import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('calendar_events')
export class CalendarEvent {
  @PrimaryGeneratedColumn('uuid')
  calendar_event_id: string;

  @Column()
  event_id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  status: string;

  @Column()
  event_type: string;

  @Column()
  event_start_date: string;

  @Column()
  event_end_date: string;

  @Column({ nullable: true })
  completed_date: string;

  @Column()
  organizer_id: string;
}
