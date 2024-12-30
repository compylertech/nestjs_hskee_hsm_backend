import { v4 as uuidv4 } from 'uuid';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

// entity
import { PropertyUnitAssoc } from './property-unit-assoc.entity';

// enums
import { PropertyAssignmentType } from '@app/contracts/properties/property/property.enum';

@Entity('property_assignment')
export class PropertyAssignment {
  @PrimaryGeneratedColumn('uuid')
  property_assignment_id: string = uuidv4();

  @Column('uuid')
  property_unit_assoc_id: string;

  @ManyToOne(() => PropertyUnitAssoc, { nullable: false })
  propertyUnitAssoc: PropertyUnitAssoc;

  @Column('uuid')
  user_id: string;

  @Column({
    type: 'enum',
    enum: PropertyAssignmentType,
  })
  assignment_type: PropertyAssignmentType;

  @Column('timestamptz', { default: () => 'CURRENT_TIMESTAMP' })
  date_from: Date;

  @Column('timestamptz', { nullable: true })
  date_to: Date;

  @Column('text')
  notes: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
