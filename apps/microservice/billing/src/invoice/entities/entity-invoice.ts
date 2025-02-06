import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity('entity_invoice')
export class EntityInvoice {
    @PrimaryGeneratedColumn('uuid')
    entity_invoice_id: string;

    @Column({ type: 'varchar', length: 128 })
    entity_id: string;

    @Column({ type: 'varchar', length: 128 }) // [contract, property etc.]
    entity_type: string;

    @Column({ type: 'varchar', length: 128 })
    invoice_number: string;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;
}