import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { CalendarEvent } from '../../calendar-event/entitites/entity';

@Entity('maintenance_requests')
export class MaintenanceRequest {
  @PrimaryGeneratedColumn('uuid')
  maintenance_request_id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  status: string;

  @Column()
  priority: string;

  @Column()
  requested_by: string;

  @Column()
  property_unit_assoc_id: string;

  @Column()
  scheduled_date: string;

  @Column({ nullable: true })
  completed_date: string;

  @Column({ default: false })
  is_emergency: boolean;

  @ManyToOne(() => CalendarEvent, { nullable: true })
  calendar_event: CalendarEvent;
}
