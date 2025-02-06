import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn,
    PrimaryGeneratedColumn,
  } from 'typeorm';

// entity
import { Invoice } from './invoice.entity';
  
  @Entity('invoice_item')
  export class InvoiceItem {
    @PrimaryGeneratedColumn('uuid')
    invoice_item_id: string;
  
    @Column({ type: 'text', nullable: false })
    description: string;
  
    @Column({ type: 'integer', nullable: false })
    quantity: number;
  
    @Column({ type: 'uuid', nullable: false })
    reference_id: string;
  
    @Column({ type: 'float', nullable: false })
    unit_price: number;
  
    @ManyToOne(() => Invoice, (invoice) => invoice.invoice_items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'invoice_id' })
    invoice: Invoice;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
  
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;
  }
  