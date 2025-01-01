import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  account_id: string;

  @Column({ type: 'varchar', length: 80 })
  bank_account_name: string;

  @Column({ type: 'varchar', length: 80 })
  bank_account_number: string;

  @Column({ type: 'varchar', length: 80 })
  account_branch_name: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
