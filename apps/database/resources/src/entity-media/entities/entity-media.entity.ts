import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    Check,
    JoinColumn,
} from 'typeorm';

// enums
import { MediaType } from '@app/contracts/resources/media/media.enum';
import { EntityMediaTypeEnum, EntityMediaTypeEnumChecks } from '@app/contracts/resources/entity-media/entity-media.enum';

// entity
import { Media } from '../../media/entities/media.entity';

@Entity('entity_media')
@Check(`"entity_type" IN (${EntityMediaTypeEnumChecks})`)
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
    @JoinColumn({ name: 'media_id' })
    media: Media;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
  
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;
}
