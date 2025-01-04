import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    Check,
    Index
} from 'typeorm';

// entity
import { Amenities } from '../../amenities/entities/amenities.entity';

// enum
import { EntityAmenityTypeEnum, EntityAmenityTypeEnumChecks } from '@app/contracts/properties/entity-amenities/entity-amenities.enum';

@Entity('entity_amenities')
@Check(`"entity_type" IN (${EntityAmenityTypeEnumChecks})`)
export class EntityAmenities {
    @PrimaryGeneratedColumn('uuid')
    entity_amenities_id: string;

    @Column({ type: 'uuid' })
    @Index()
    amenity_id: string;

    @ManyToOne(() => Amenities, (amenity) => amenity.amenity_id, { eager: true })
    @JoinColumn({ name: 'amenity_id' })
    amenity: Amenities;

    @Column({ type: 'uuid' })
    @Index()
    entity_id: string;

    @Column({
        type: 'enum',
        enum: EntityAmenityTypeEnum,
    })
    entity_type: EntityAmenityTypeEnum;

    @Column({ type: 'boolean', default: false })
    apply_to_units: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
  
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;
}
