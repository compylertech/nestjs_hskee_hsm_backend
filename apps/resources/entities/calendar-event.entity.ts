import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('calendar_events')
export class CalendarEvent {
  @PrimaryGeneratedColumn('uuid')
  calendar_event_id: string;

  @Column()
  event_id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
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

  @ManyToOne(() => CalendarEvent, (calendarEvent) => calendarEvent.calendar_event_id)
  organizer: User;
  user: any;
}
