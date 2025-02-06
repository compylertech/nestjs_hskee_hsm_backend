import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";

// enum
import { EventTypeEnum } from "@app/contracts/communication/calendar-event/event-type.enum";
import { CalendarStatusEnum } from "@app/contracts/communication/calendar-event/calendar-status.enum";

// entity
import { User } from "@app/modules/auth/src/users/entities/user.entity";


@Entity('calendar_events')
export class CalendarEvent {
    @PrimaryGeneratedColumn('uuid')
    calendar_event_id: string;

    @Column({ type: 'varchar', length: 128, unique: true })
    event_id: string;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ type: 'enum', enum: CalendarStatusEnum, default: CalendarStatusEnum.PENDING })
    status: CalendarStatusEnum;

    @Column({ type: 'enum', enum: EventTypeEnum, default: EventTypeEnum.OTHER, nullable: true })
    event_type?: EventTypeEnum;

    @Column({ type: 'timestamptz', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
    event_start_date?: Date;

    @Column({ type: 'timestamptz', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
    event_end_date?: Date;

    @Column({ type: 'timestamptz', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
    completed_date?: Date;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'organizer_id' })
    organizer: User;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
  
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;
}