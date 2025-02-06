import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

// enums
import { PaymentTypeEnum } from "@app/contracts/billing/transaction/payment-type/payment-type.enum";

@Entity('payment_type')
export class PaymentType {
    @PrimaryGeneratedColumn()
    payment_type_id: number;

    @Column({ type: 'enum', enum: PaymentTypeEnum })
    payment_type_name: PaymentTypeEnum;

    @Column({ type: 'text' })
    payment_type_description: string;

    @Column({ type: 'int' })
    payment_partitions: number;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;
}
