import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('attendance_logs')
export class AttendanceLog {
  @PrimaryGeneratedColumn('uuid')
  attendance_id: string;

  @Column({ type: 'timestamptz' })
  check_in_time: Date;

  @Column({ type: 'timestamptz', nullable: true })
  check_out_time: Date;

  @Column({ type: 'timestamptz' })
  date_stamp: Date;

  @ManyToOne(() => User, (user) => user.attendance_logs)
  user: User;
}
