import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  account_id: string;

  @Column()
  account_type: string;

  @Column()
  bank_account_name: string;

  @Column()
  bank_account_number: string;

  @Column()
  account_branch_name: string;

  @ManyToOne(() => User, (user) => user.accounts)
  user: User;
}
