import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TourBooking } from '../tour-booking/entitiies/entity';
import { TourBookingService } from './tour-booking.service';
import { TourBookingController } from './tour-booking.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TourBooking])],
  providers: [TourBookingService],
  controllers: [TourBookingController],
  exports: [TourBookingService],
})
export class TourBookingModule {}
