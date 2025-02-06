import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

// entity
import { Utilities } from "@app/modules/resources/src/utilities/entities/utility.enity";

@Entity('billable_assoc')
export class BillableAssoc {
    @PrimaryGeneratedColumn('uuid')
    billable_assoc_id: string;

    @Column({ type: 'varchar' })
    billing_type: string;

    @OneToOne(() => Utilities, (utilities) => utilities.billable_assoc)
    utilities: Utilities;
    
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
  
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;
}