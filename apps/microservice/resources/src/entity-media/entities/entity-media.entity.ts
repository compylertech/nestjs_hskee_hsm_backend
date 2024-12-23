import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    Check,
} from 'typeorm';

// enums
import { MediaType } from '@app/contracts/resources/media/media.enum';
import { EntityMediaTypeEnum } from '@app/contracts/resources/entity-media/entity-media.enum';

// entity
import { Media } from '../../media/entities/media.entity';

@Entity('entity_media')
@Check(
    "entity_type IN ('property', 'user', 'units', 'amenities', 'entity_amenities', 'contract', 'maintenance_requests')"
)
export class EntityMedia {
    @PrimaryGeneratedColumn('uuid')
    entity_media_id: string;

    @Column({ type: 'uuid', nullable: false })
    media_id: string;

    @Column({ type: 'uuid', nullable: false })
    entity_id: string;

    @Column({ type: 'enum', enum: EntityMediaTypeEnum, nullable: false })
    entity_type: EntityMediaTypeEnum;

    @Column({ type: 'enum', enum: MediaType, default: MediaType.OTHER, nullable: false })
    media_type: MediaType;

    @ManyToOne(() => Media, (media) => media.entity_media, { onDelete: 'CASCADE' })
    media: Media;
}
