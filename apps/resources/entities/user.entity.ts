import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToMany,
    JoinTable,
  } from 'typeorm';
  import { Address } from './address.entity';
  import { Role } from './role.entity';
  import { Media } from './media.entity';
  import { AttendanceLog } from './attendance-log.entity';
  import { Account } from './account.entity';
  import { Questionnaire } from './questionnaire.entity';
  import { CalendarEvent } from './calendar-event.entity';
  
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
  
    @Column()
    phone_number: string;
  
    @Column()
    identification_number: string;
  
    @Column({ nullable: true })
    photo_url: string;
  
    @Column()
    login_provider: string;
  
    @Column({ nullable: true })
    verification_token: string;
  
    @Column({ nullable: true })
    is_subscribed_token: string;
  
    @Column({ default: false })
    is_disabled: boolean;
  
    @Column({ default: false })
    is_verified: boolean;
  
    @Column({ default: false })
    is_subscribed: boolean;
  
    @Column({ default: false })
    is_onboarded: boolean;
  
    @Column({ default: false })
    is_approved: boolean;
  
    @Column({ default: false })
    is_rejected: boolean;
  
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
  
    // Relationships
    @OneToMany(() => Address, (address) => address.user, { cascade: true })
    address: Address[];
  
    @ManyToMany(() => Role, (role) => role.users, { cascade: true })
    @JoinTable()
    roles: Role[];
  
    @OneToMany(() => Media, (media) => media.user, { cascade: true })
    media: Media[];
  
    @OneToMany(() => Account, (account) => account.user, { cascade: true })
    accounts: Account[];
  
    @OneToMany(() => AttendanceLog, (attendanceLog) => attendanceLog.user, { cascade: true })
    attendance_logs: AttendanceLog[];
  
    @OneToMany(() => Questionnaire, (questionnaire) => questionnaire.user, { cascade: true })
    questionnaires: Questionnaire[];
  
    @OneToMany(() => CalendarEvent, (calendarEvent) => calendarEvent.user, { cascade: true })
    calendarEvent: Account[];

    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
  }
  