import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { AttendanceLog } from '../../attendance_log/entities/attendance-log.entity';
import { EntityQuestionnaire } from '../../../../forms/src/questionnaire/entities/entity-questionnaire.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  gender: string;

  @Column({ type: 'date' })
  date_of_birth: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password?: string;

  @Column()
  phone_number: string;

  @Column()
  identification_number: string;

  @Column({ nullable: true })
  photo_url: string;

  @Column({ nullable: true })
  login_provider?: string;

  @Column({ nullable: true })
  verification_token?: string;

  @Column({ nullable: true })
  reset_token?: string;

  @Column({ nullable: true })
  is_subscribed_token?: string;

  @Column({ default: false })
  is_disabled?: boolean;

  @Column({ default: false })
  is_verified?: boolean;

  @Column({ default: false })
  is_subscribed?: boolean;

  @Column({ default: false })
  is_onboarded?: boolean;

  @Column({ default: false })
  is_approved?: boolean;

  @Column({ default: false })
  is_rejected?: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  last_login_time: Date;

  @Column({ type: 'timestamptz', nullable: true })
  current_login_time: Date;

  @Column({ nullable: true })
  emergency_contact_name: string;

  @Column({ nullable: true })
  emergency_contact_email: string;

  @Column({ nullable: true })
  emergency_contact_relation: string;

  @Column({ nullable: true })
  emergency_contact_number: string;

  @OneToMany(() => AttendanceLog, (attendanceLog) => attendanceLog.user, { cascade: true, eager: true })
  attendance_logs: AttendanceLog[];

  // @OneToMany(() => EntityQuestionnaire, (entityQuestionnaire) => entityQuestionnaire.user, { cascade: true, eager: true })
  // answers: EntityQuestionnaire[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
