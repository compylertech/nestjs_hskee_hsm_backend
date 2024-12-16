import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    UpdateDateColumn,
    Column,
  } from "typeorm";

// entity
import { User } from "../../users/entities/user.entity";
  
  @Entity("attendance_log")
  export class AttendanceLog {
    @PrimaryGeneratedColumn("uuid")
    attendance_log_id: string;

    @Column({ name: 'user_id', nullable: false })
    user_id: string;

    @ManyToOne(() => User, (user) => user.attendance_logs, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;
  
    @Column({ type: 'timestamp', nullable: false })
    check_in_time: Date;
  
    @Column({ type: 'timestamp', nullable: true })
    check_out_time: Date;

    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
  }
  