import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('amenities')
export class Amenities {
    @PrimaryGeneratedColumn('uuid')
    amenity_id: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    amenity_name?: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    amenity_short_name?: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
  
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;
}
 