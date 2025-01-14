import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  transaction_id: string;

  @Column()
  transaction_number: string;

  @Column()
  payment_type_id: number;

  @Column()
  client_offered: string;

  @Column()
  client_requested: string;

  @Column({ type: 'timestamp' })
  transaction_date: Date;

  @Column()
  transaction_details: string;

  @Column()
  transaction_type: number;

  @Column()
  transaction_status: string;

  @Column()
  invoice_number: string;
}
