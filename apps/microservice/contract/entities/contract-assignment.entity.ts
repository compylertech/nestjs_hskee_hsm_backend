import { 
    Entity, 
    Column, 
    ManyToOne, 
    JoinColumn, 
    CreateDateColumn, 
    UpdateDateColumn,
    PrimaryGeneratedColumn
} from 'typeorm';

// enum
import { ContractStatusEnum } from '@app/contracts/contract/contract/contract.enum';

// entity
import { Contract } from './contract.entity';
import { User } from '@app/modules/auth/src/users/entities/user.entity';
import { PropertyUnitAssoc } from '@app/modules/properties/src/property/entities/property-unit-assoc.entity';


@Entity('contract_assignment')
export class ContractAssignment {
    @PrimaryGeneratedColumn('uuid')
    contract_assignment_id: string;

    @ManyToOne(() => PropertyUnitAssoc)
    @JoinColumn({ name: 'property_unit_assoc_id' })
    property_unit_assoc: PropertyUnitAssoc;

    @Column({ type: 'enum', enum: ContractStatusEnum })
    contract_status: ContractStatusEnum;

    @ManyToOne(() => Contract)
    @JoinColumn({ name: 'contract_number' })
    contract: Contract;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'client_id' })
    client: User;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'employee_id' })
    employee: User;

    @Column({ type: 'timestamptz' })
    start_date: Date;

    @Column({ type: 'timestamptz' })
    end_date: Date;

    @Column({ type: 'timestamptz' })
    next_payment_due: Date;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;
}