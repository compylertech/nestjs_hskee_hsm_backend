import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Check, Index, JoinColumn } from 'typeorm';

// entity
import { Account } from '../../account/entities/account.entity';

// enum
import { AccountTypeEnum, EntityAccountTypeEnum, EntityAccountTypeEnumChecks } from '@app/contracts';

@Entity('entity_account')
@Check(`"entity_type" IN (${EntityAccountTypeEnumChecks})`)
export class EntityAccount {
  @PrimaryGeneratedColumn('uuid')
  entity_account_id: string;

  @Column({ type: 'uuid' })
  @Index()
  account_id: string;

  @ManyToOne(() => Account, (account) => account.entity_accounts)
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @Column({
    type: 'enum',
    enum: AccountTypeEnum,
  })
  account_type: AccountTypeEnum;

  @Column({ type: 'uuid' })
  entity_id: string;

  @Column({
    type: 'enum',
    enum: EntityAccountTypeEnum,
  })
  entity_type: EntityAccountTypeEnum;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
