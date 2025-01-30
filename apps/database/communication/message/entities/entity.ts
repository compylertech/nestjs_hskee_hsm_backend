import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  message_id: string;

  @Column()
  subject: string;

  @Column()
  sender_id: string;

  @Column({ type: 'text' })
  message_body: string;

  @Column({ nullable: true })
  parent_message_id: string;

  @Column({ nullable: true })
  thread_id: string;

  @Column({ default: false })
  is_draft: boolean;

  @Column({ default: false })
  is_notification: boolean;

  @Column({ default: false })
  is_reminder: boolean;

  @Column({ default: false })
  is_scheduled: boolean;

  @Column({ default: false })
  is_read: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_created: Date;

  @Column({ nullable: true })
  scheduled_date: string;

  @Column({ nullable: true })
  next_remind_date: string;

  @Column({ nullable: true })
  reminder_frequency_id: number;

  @Column('uuid', { array: true, default: () => 'ARRAY[]::uuid[]' })
  recipient_ids: string[];

  @Column('uuid', { array: true, default: () => 'ARRAY[]::uuid[]' })
  recipient_groups: string[];
}
