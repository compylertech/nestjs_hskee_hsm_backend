import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  BeforeInsert,
} from 'typeorm';

// entity
import { Property } from './property.entity';
import { Unit } from '../../unit/entities/unit.entity';

@Entity('property_unit_assoc')
export class PropertyUnitAssoc {
  @PrimaryGeneratedColumn('uuid')
  property_unit_assoc_id: string;

  @Column({nullable: true})
  property_unit_type: string;

  @OneToOne(() => Property, (property) => property.property_unit_assoc)
  property: Property;

  @OneToOne(() => Unit, (unit) => unit.property_unit_assoc)
  unit: Unit;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @BeforeInsert()
  setDiscriminatorValue() {
    // if (this.property) {
    //   this.property_unit_type = this.property.property_unit_type;
    //   console.log(`In property here`)
    // } else if (this.unit) {
    //   this.property_unit_type = this.unit.property_unit_type;
    //   console.log(`In unit here`)
    // } else {
    //   console.log(`not found here`)
    //   this.property_unit_type = this.property_unit_type || this.property.property_unit_type || this.unit.property_unit_type

    // }
  }
}