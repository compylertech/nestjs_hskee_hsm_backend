import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";

// enum
import { ServiceRequestStatusEnum } from "@app/contracts/communication/service-request/service-request.enum";

// entity
import { CalendarEvent } from "../../calendar-event/entities/calendar-event.entity";
import { User } from "@app/modules/auth/src/users/entities/user.entity";


@Entity('service_request')
export class ServiceRequest {
    @PrimaryGeneratedColumn('uuid')
    service_request_id: string;

    @Column({ type: 'varchar', length: 128, unique: true })
    task_number: string;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ type: 'enum', enum: ServiceRequestStatusEnum, default: ServiceRequestStatusEnum.PENDING })
    status: ServiceRequestStatusEnum;

    @Column({ type: 'boolean', default: false })
    is_emergency: boolean;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'requested_by' })
    requested_by: User;

    @Column({ type: 'timestamptz', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
    scheduled_date?: Date;

    @Column({ type: 'timestamptz', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
    completed_date?: Date;

    @ManyToOne(() => CalendarEvent, { nullable: true })
    @JoinColumn({ name: 'calendar_event_id' })
    calendar_event?: CalendarEvent;
    
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
  
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;
}