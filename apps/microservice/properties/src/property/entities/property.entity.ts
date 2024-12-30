import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

// entity
import { PropertyType } from './property-type.entity';
import { PropertyUnitAssoc } from './property-unit-assoc.entity';

// enum
import { PropertyStatus } from '@app/contracts/properties/property/property.enum';


@Entity('property')
export class Property extends PropertyUnitAssoc {
  @Column({ length: 255 })
  name: string;

  @ManyToOne(() => PropertyType, { eager: true, nullable: false })
  property_type: PropertyType;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column('decimal', { precision: 10, scale: 2 })
  security_deposit: number;

  @Column('decimal', { precision: 10, scale: 2 })
  commission: number;

  @Column('decimal', { precision: 8, scale: 2 })
  floor_space: number;

  @Column()
  num_units: number;

  @Column()
  num_bathrooms: number;

  @Column()
  num_garages: number;

  @Column({ default: false })
  has_balconies: boolean;

  @Column({ default: false })
  has_parking_space: boolean;

  @Column({ default: false })
  pets_allowed: boolean;

  @Column('text', { nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: PropertyStatus,
  })
  property_status: PropertyStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}