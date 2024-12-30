import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('property_type')
export class PropertyType {
  @PrimaryGeneratedColumn()
  property_type_id: number;

  @Column({ length: 128, unique: true })
  name: string;

  @Column('text')
  description: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}