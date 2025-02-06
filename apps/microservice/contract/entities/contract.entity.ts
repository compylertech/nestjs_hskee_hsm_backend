import { 
    Entity,
    Column, 
    ManyToOne, 
    OneToMany, 
    JoinColumn, 
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryGeneratedColumn
} from 'typeorm';

// enums
import { ContractStatusEnum } from '@app/contracts/contract/contract/contract.enum';

// entities
import { ContractType } from './contract-type.entity';
import { ContractAssignment } from './contract-assignment.entity';
import { PaymentType } from '@app/modules/billing/src/payment-type/entities/payment-type.entity';

@Entity('contract')
export class Contract {
    @PrimaryGeneratedColumn('uuid')
    contract_id: string;

    @Column({ type: 'varchar', length: 128, unique: true })
    contract_number: string;

    @ManyToOne(() => ContractType, contractType => contractType.contracts)
    @JoinColumn({ name: 'contract_type_id' })
    contract_type: ContractType;

    @ManyToOne(() => PaymentType)
    @JoinColumn({ name: 'payment_type_id' })
    payment_type: PaymentType;

    @Column({ type: 'enum', enum: ContractStatusEnum })
    contract_status: ContractStatusEnum;

    @Column({ type: 'text' })
    contract_details: string;

    @Column({ type: 'int', default: 0 })
    num_invoices: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    payment_amount: number;

    @Column({ type: 'decimal', precision: 5, scale: 2 })
    fee_percentage: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    fee_amount: number;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date_signed: Date;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    start_date: Date;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    end_date: Date;

    @OneToMany(() => ContractAssignment, contractAssignment => contractAssignment.contract)
    assignments: ContractAssignment[];

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;
}