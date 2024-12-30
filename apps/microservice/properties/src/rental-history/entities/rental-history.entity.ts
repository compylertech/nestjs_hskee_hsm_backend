import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('past_rental_history')
export class RentalHistory {
  @PrimaryGeneratedColumn('uuid')
  rental_history_id: string = uuidv4();

  @Column('timestamptz')
  start_date: Date;

  @Column('timestamptz')
  end_date: Date;

  @Column()
  property_owner_name: string;

  @Column()
  property_owner_email: string;

  @Column()
  property_owner_mobile: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
