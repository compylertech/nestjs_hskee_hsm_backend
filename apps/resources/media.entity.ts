import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('media')
export class Media {
  @PrimaryGeneratedColumn('uuid')
  media_id: string;

  @Column()
  media_name: string;

  @Column()
  media_type: string;

  @Column()
  content_url: string;

  @Column({ default: false })
  is_thumbnail: boolean;

  @ManyToOne(() => User, (user) => user.media)
  user: User;
}
