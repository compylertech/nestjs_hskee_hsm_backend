import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// entity
import { EntityAmenities } from './entities/entity-amenities.entity';

// services
import { EntityAmenitiesService } from './entity-amenities.service';

// controllers
import { EntityAmenitiesController } from './entity-amenities.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EntityAmenities])],
  controllers: [EntityAmenitiesController],
  providers: [EntityAmenitiesService],
})
export class EntityAmenitiesModule {}
