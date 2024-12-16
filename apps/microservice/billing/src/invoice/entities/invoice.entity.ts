import {
    Index,
    Entity,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  
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
  
    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
  }
  
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

    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
  }
  