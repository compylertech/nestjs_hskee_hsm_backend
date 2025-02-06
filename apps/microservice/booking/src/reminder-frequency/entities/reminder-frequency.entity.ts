import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

// entity
import { Message } from "../../message/entities/message.entity";

@Entity('reminder_frequency')
export class ReminderFrequency {
    @PrimaryGeneratedColumn()
    reminder_frequency_id: number;

    @Column({ type: 'varchar', length: 50 })
    title: string;

    @Column({ type: 'int' })
    frequency: number;

    @Column({ type: 'boolean', default: false })
    is_active: boolean;

    @OneToMany(() => Message, message => message.reminder_frequency)
    messages: Message[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
  
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;
}
