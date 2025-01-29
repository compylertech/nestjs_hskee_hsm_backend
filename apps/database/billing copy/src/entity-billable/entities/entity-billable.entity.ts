import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Index,
} from 'typeorm';

// enum
import { EntityBillableTypeEnum, BillableTypeEnum } from '@app/contracts';

@Entity('entity_billable')
export class EntityBillable {
    @PrimaryGeneratedColumn('uuid')
    entity_billable_id: string;

    @Column({ type: 'uuid' })
    @Index()
    entity_id: string;

    @Column({
        type: 'enum',
        enum: EntityBillableTypeEnum,
        nullable: true,
    })
    entity_type: EntityBillableTypeEnum;

    @Column({ type: 'uuid' })
    billable_id: string;

    @Column({
        type: 'enum',
        enum: BillableTypeEnum,
    })
    billable_type: BillableTypeEnum;

    @Column({ type: 'numeric', precision: 10, scale: 2 })
    billable_amount: number;

    @Column({ type: 'boolean', default: false })
    apply_to_units: boolean;

    @Column({ type: 'int', nullable: true })
    payment_type_id: number | null;

    @Column({ type: 'timestamptz', nullable: true })
    start_period: Date | null;

    @Column({ type: 'timestamptz', nullable: true })
    end_period: Date | null;
}
