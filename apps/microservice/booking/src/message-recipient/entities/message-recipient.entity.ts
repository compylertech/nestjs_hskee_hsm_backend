import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from "typeorm";

import { Message } from "../../message/entities/message.entity";
import { User } from "@app/modules/auth/src/users/entities/user.entity";
import { PropertyUnitAssoc } from "@app/modules/properties/src/property/entities/property-unit-assoc.entity";


@Entity('message_recipient')
export class MessageRecipient {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'recipient_id' })
    recipient: User;

    @ManyToOne(() => PropertyUnitAssoc, { nullable: true })
    @JoinColumn({ name: 'recipient_group_id' })
    recipient_group?: PropertyUnitAssoc;

    @ManyToOne(() => Message, { nullable: true })
    @JoinColumn({ name: 'message_id' })
    message?: Message;

    @Column({ type: 'boolean', nullable: true })
    is_read?: boolean;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    msg_send_date: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
  
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;
}

