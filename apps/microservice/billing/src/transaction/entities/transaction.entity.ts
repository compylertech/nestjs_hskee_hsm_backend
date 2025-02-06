import { 
    Entity,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryGeneratedColumn
} from 'typeorm';

// entity
import { User } from '@app/modules/auth/src/users/entities/user.entity';
import { PaymentType } from '../../payment-type/entities/payment-type.entity';
import { TransactionType } from '../../transaction-type/entities/transaction-type.entity';

// enum
import { PaymentStatusEnum } from '@app/contracts/billing/transaction/payment-status/payment-status.enum';

@Entity('transaction')
export class Transaction {
    @PrimaryGeneratedColumn('uuid')
    transaction_id: string;

    @Column({ type: 'varchar', length: 128, unique: true })
    transaction_number: string;

    @ManyToOne(() => PaymentType)
    @JoinColumn({ name: 'payment_type_id' })
    payment_type: PaymentType;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'client_offered' })
    client_offered: User;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'client_requested' })
    client_requested: User;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    transaction_date: Date;

    @Column({ type: 'text' })
    transaction_details: string;

    @ManyToOne(() => TransactionType, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'transaction_type' })
    transaction_type: TransactionType;

    @Column({ type: 'enum', enum: PaymentStatusEnum })
    transaction_status: PaymentStatusEnum;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;
}
