import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

// entity
import { EntityAccount } from '../../entity-account/entities/entity-account.entity';

// enum
import { AccountTypeEnum } from '@app/contracts';

@Entity('account')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  account_id: string;

  @OneToMany(() => EntityAccount, (entityAccount) => entityAccount.account)
  entity_accounts: EntityAccount[];

  @Column({ type: 'varchar', length: 80 })
  bank_account_name: string;

  @Column({ type: 'varchar', length: 80 })
  bank_account_number: string;

  @Column({
    type: 'enum',
    enum: AccountTypeEnum,
  })
  account_type: AccountTypeEnum;

  @Column({ type: 'varchar', length: 80 })
  account_branch_name: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
