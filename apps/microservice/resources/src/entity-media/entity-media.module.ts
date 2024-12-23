import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// entity
import { EntityMedia } from './entities/entity-media.entity';

// services
import { EntityMediaService } from './entity-media.service';

// controllers
import { EntityMediaController } from './entity-media.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EntityMedia])],
  controllers: [EntityMediaController],
  providers: [EntityMediaService],
})
export class EntityMediaModule {}
