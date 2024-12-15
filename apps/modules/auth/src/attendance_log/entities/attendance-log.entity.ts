import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
  } from "typeorm";
import { User } from "../../users/entities/user.entity";
  
  @Entity("attendance-log")
  export class AttendanceLog {
    @PrimaryGeneratedColumn("uuid")
    attendance_log_id: string;

    @ManyToOne(() => User, (user) => user.attendance_logs, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;
  
    @CreateDateColumn()
    check_in_time: Date;
  
    @CreateDateColumn({ nullable: true })
    check_out_time: Date;
  }
  