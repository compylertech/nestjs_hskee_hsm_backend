import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

// enums
import { MediaType } from '@app/contracts/resources/media/media.enum';

// entity
import { EntityMedia } from '../../entity-media/entities/entity-media.entity';

@Entity('media')
export class Media {
    @PrimaryGeneratedColumn('uuid')
    media_id: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    media_name: string | null;

    @Column({ type: 'enum', enum: MediaType, nullable: true })
    media_type: MediaType | null;

    @Column({ type: 'text', nullable: true })
    content_url?: string | null;

    @Column({ type: 'boolean', default: false })
    is_thumbnail?: boolean | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    caption: string | null;

    @Column({ type: 'text', nullable: true })
    description?: string | null;

    @OneToMany(() => EntityMedia, (entityMedia) => entityMedia.media, { cascade: true })
    entity_media: EntityMedia[];
}