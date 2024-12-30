import { Entity, Column, ManyToOne } from 'typeorm';

// entity
import { Property } from '../../property/entities/property.entity';
import { PropertyUnitAssoc } from '../../property/entities/property-unit-assoc.entity';

// enum
import { PropertyStatus } from '@app/contracts/properties/property/property.enum';

@Entity('units')
export class Unit extends PropertyUnitAssoc {
  @Column({ length: 128 })
  property_unit_code: string;

  @Column()
  property_unit_floor_space: number;

  @Column('decimal', { precision: 10, scale: 2 })
  property_unit_amount: number;

  @Column('decimal', { precision: 10, scale: 2 })
  property_unit_security_deposit: number;

  @Column('decimal', { precision: 10, scale: 2 })
  property_unit_commission: number;

  @Column()
  property_floor_id: number;

  @Column({
    type: 'enum',
    enum: PropertyStatus,
  })
  property_status: PropertyStatus;

  @Column('text')
  property_unit_notes: string;

  @Column({ default: false })
  has_amenities: boolean;

  @ManyToOne(() => Property, { nullable: false })
  property: Property;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
