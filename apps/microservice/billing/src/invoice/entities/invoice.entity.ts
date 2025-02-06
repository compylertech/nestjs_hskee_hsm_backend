import {
    Entity,
    Column,
    OneToMany,
    PrimaryGeneratedColumn,
  } from 'typeorm';

// entity
import { InvoiceItem } from './invoice-item.entity';
  
  @Entity('invoice')
  export class Invoice {
    @PrimaryGeneratedColumn('uuid')
    invoice_id: string;
  
    @Column({ type: 'timestamp', nullable: false })
    date_paid: Date;
  
    @Column({ type: 'timestamp', nullable: false })
    due_date: Date;
  
    @Column({ type: 'text', nullable: false })
    invoice_details: string;
  
    @Column({ type: 'enum', enum: ['sale', 'lease', 'other'], nullable: false })
    invoice_type: string;
  
    @Column({ type: 'enum', enum: ['pending', 'paid', 'expired', 'cancelled'], nullable: false })
    status: string;
  
    @Column({ type: 'uuid', nullable: false })
    issued_by: string;
  
    @Column({ type: 'uuid', nullable: false })
    issued_to: string;
  
    @OneToMany(() => InvoiceItem, (item) => item.invoice, { cascade: true, eager: true })
    invoice_items: InvoiceItem[];
  
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
  
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;
  }