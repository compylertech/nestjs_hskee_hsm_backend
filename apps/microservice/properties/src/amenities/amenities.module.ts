import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// entity
import { Amenities } from './entities/amenities.entity';
// import { EntityAmenities } from '../entity-amenities/entities/entity-amenities.entity';

// services
import { AmenitiesService } from './amenities.service';

// controllers
import { AmenitiesController } from './amenities.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Amenities])],
  controllers: [AmenitiesController],
  providers: [AmenitiesService],
  // exports: [Amenities]
})
export class AmenitiesModule {}
