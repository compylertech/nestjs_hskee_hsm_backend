import { 
    Entity,
    Column, 
    OneToMany, 
    CreateDateColumn, 
    UpdateDateColumn,
    PrimaryGeneratedColumn
} from 'typeorm';

// enum
import { ContractTypeEnum } from '@app/contracts/contract/contract/contract.enum';

// contract
import { Contract } from './contract.entity';


@Entity('contract_type')
export class ContractType {
    @PrimaryGeneratedColumn()
    contract_type_id: number;

    @Column({ type: 'enum', enum: ContractTypeEnum, unique: true })
    contract_type_name: ContractTypeEnum;

    @Column({ type: 'decimal', precision: 5, scale: 2 })
    fee_percentage: number;

    @OneToMany(() => Contract, contract => contract.contract_type)
    contracts: Contract[];

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;
}
