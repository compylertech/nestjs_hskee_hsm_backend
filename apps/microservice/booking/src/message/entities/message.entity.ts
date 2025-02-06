import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";

// entity
import { User } from "@app/modules/auth/src/users/entities/user.entity";
import { ReminderFrequency } from "../../reminder-frequency/entities/reminder-frequency.entity";

@Entity('message')
export class Message {
    @PrimaryGeneratedColumn('uuid')
    message_id: string;

    @Column({ type: 'varchar', length: 128, nullable: true })
    subject?: string;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'sender_id' })
    sender?: User;

    @Column({ type: 'text', nullable: true })
    message_body?: string;

    @ManyToOne(() => Message, { nullable: true })
    @JoinColumn({ name: 'parent_message_id' })
    parent_message?: Message;

    @ManyToOne(() => Message, { nullable: true })
    @JoinColumn({ name: 'thread_id' })
    thread?: Message;

    @Column({ type: 'boolean', default: false })
    is_draft?: boolean;

    @Column({ type: 'boolean', default: false })
    is_notification?: boolean;

    @Column({ type: 'boolean', default: false })
    is_enquiry?: boolean;

    @Column({ type: 'boolean', default: false })
    is_reminder?: boolean;

    @Column({ type: 'boolean', default: false })
    is_scheduled?: boolean;

    @Column({ type: 'boolean', default: false })
    is_read?: boolean;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    scheduled_date: Date;

    @Column({ type: 'timestamptz', nullable: true })
    next_remind_date?: Date;

    @ManyToOne(() => ReminderFrequency, { nullable: true })
    @JoinColumn({ name: 'reminder_frequency_id' })
    reminder_frequency?: ReminderFrequency;
    
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
  
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;
}