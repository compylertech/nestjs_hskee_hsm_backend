import { v4 as uuidv4 } from 'uuid';
import { Entity, PrimaryGeneratedColumn, Column, TableInheritance } from 'typeorm';


@Entity('property_unit_assoc')
@TableInheritance({ column: { type: 'varchar', name: 'property_unit_type' } })
export class PropertyUnitAssoc {
  @PrimaryGeneratedColumn('uuid')
  property_unit_assoc_id: string = uuidv4();

  @Column()
  property_unit_type: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}