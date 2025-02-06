import { 
    Entity,
    Column,
    CreateDateColumn, 
    UpdateDateColumn,
    PrimaryGeneratedColumn
} from 'typeorm';

// enum
import { TransactionTypeEnum } from '@app/contracts/billing/transaction/transaction-type/transaction-type.enum';

@Entity('transaction_type')
export class TransactionType {
    @PrimaryGeneratedColumn()
    transaction_type_id: number;

    @Column({ type: 'enum', enum: TransactionTypeEnum, unique: true })
    transaction_type_name: TransactionTypeEnum;

    @Column({ type: 'varchar', length: 128 })
    transaction_type_description: string;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;
}