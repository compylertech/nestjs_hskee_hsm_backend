import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('unit_type')
export class UnitType {
  @PrimaryGeneratedColumn()
  unit_type_id: number;

  @Column({ length: 128 })
  unit_type_name: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
