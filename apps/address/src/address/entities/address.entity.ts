import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('address')
@Index(['city', 'region', 'country']) 
export class Address {
    @PrimaryGeneratedColumn('uuid')
    address_id: string;

    @Column({ type: 'varchar', length: 50 })
    address_type: string;

    @Column({ type: 'boolean', default: false })
    primary: boolean;

    @Column({ type: 'varchar', length: 255 })
    address_1: string;

    @Column({ type: 'varchar', length: 100 })
    city: string;

    @Column({ type: 'varchar', length: 100 })
    region: string;

    @Column({ type: 'varchar', length: 100 })
    country: string;

    @Column({ type: 'varchar', length: 20 })
    address_postalcode: string;

    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
}