import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Check, Index } from 'typeorm';

// entity
import { Account } from '../../account/entities/account.entity';

// enum
import { AccountTypeEnum, EntityAccountTypeEnum } from '@app/contracts';

@Entity('entity_account')
@Check(`"entity_type" IN ('property', 'user')`)
export class EntityAccount {
  @PrimaryGeneratedColumn('uuid')
  entity_account_id: string;

  @Column({ type: 'uuid' })
  @Index()
  account_id: string;

  @ManyToOne(() => Account, (account) => account.entity_accounts)
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
}
