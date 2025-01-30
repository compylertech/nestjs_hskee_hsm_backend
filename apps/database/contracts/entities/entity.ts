import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Utility } from './utility.entity';
import { Invoice } from './invoice.entity';
import { ContractUnder } from './contract-under.entity';
import { Media } from './media.entity';

@Entity('contracts')
export class Contract {
  @PrimaryGeneratedColumn('uuid')
  contract_id: string;

  @Column()
  contract_number: string;

  @Column()
  contract_type_id: string;

  @Column()
  payment_type_id: string;

  @Column()
  contract_status: string;

  @Column({ type: 'text' })
  contract_details: string;

  @Column()
  num_invoices: number;

  @Column({ type: 'float' })
  payment_amount: number;

  @Column({ type: 'float' })
  fee_percentage: number;

  @Column({ type: 'float' })
  fee_amount: number;

  @Column()
  date_signed: string;

  @Column()
  start_date: string;

  @Column()
  end_date: string;

  @OneToMany(() => Utility, (utility) => utility.contract, { cascade: true })
  utilities: Utility[];

  @OneToMany(() => Invoice, (invoice) => invoice.contract, { cascade: true })
  invoices: Invoice[];

  @OneToMany(() => ContractUnder, (underContract) => underContract.contract, { cascade: true })
  under_contract: ContractUnder[];

  @OneToMany(() => Media, (media) => media.contract, { cascade: true })
  media: Media[];
}
