import { Entity, Column, JoinColumn, OneToOne, PrimaryGeneratedColumn, BeforeInsert } from "typeorm";

// enitity
import { BillableAssoc } from "@app/modules/billing/src/entity-billable/entities/billable.entity";

// service
import { BillableAssocService } from "@app/modules/billing/src/entity-billable/billable-assoc.service";

@Entity('utilities')
export class Utilities {
    private static billableAssocService: BillableAssocService;

    public static setBillableAssocService(service: BillableAssocService) {
      this.billableAssocService = service;
    }

    @PrimaryGeneratedColumn('uuid')
    billable_assoc_id: string;
  
    @OneToOne(() => BillableAssoc, (billableAssoc) => billableAssoc.utilities, { cascade: true })
    @JoinColumn({ name: 'billable_assoc_id' })
    billable_assoc: BillableAssoc;

    @Column({ type: 'varchar', length: 128 })
    name: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
  
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @BeforeInsert()
    async createPropertyUnitAssoc() {
        if (!Utilities.billableAssocService) {
        throw new Error('BillableAssocService is not initialized.');
        }

        const assoc = Utilities.billableAssocService.billableAssocRepository.create({
            billing_type: 'Utility',
        });

        const savedAssoc = await Utilities.billableAssocService.billableAssocRepository.save(assoc);
        this.billable_assoc_id = savedAssoc.billable_assoc_id;
    }
}