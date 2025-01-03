import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Check,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

// enum
import { EntityAddressTypeEnum } from '@app/contracts';

// entity
import { Address } from '../../address/entities/address.entity';

@Entity('entity_address')
@Check(`"entity_type" IN ('property', 'user', 'pastrentalhistory', 'account', 'role')`)
export class EntityAddress {
    @PrimaryGeneratedColumn('uuid')
    entity_address_id: string;

    @Column({ type: 'uuid' })
    entity_id: string;

    @Column({
        type: 'enum',
        enum: EntityAddressTypeEnum,
    })
    entity_type: EntityAddressTypeEnum;

    @Column({ type: 'uuid' })
    address_id: string;

    @ManyToOne(() => Address)
    @JoinColumn({ name: 'address_id' })
    address: Address;

    @Column({ type: 'boolean', default: false, nullable: true })
    emergency_address: boolean;
}
