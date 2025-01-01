import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// entity
import { Media } from './entities/media.entity';

// services
import { MediaService } from './media.service';

// controllers
import { MediaController } from './media.controller';
import { EntityMedia } from '../entity-media/entities/entity-media.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Media, EntityMedia])],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
