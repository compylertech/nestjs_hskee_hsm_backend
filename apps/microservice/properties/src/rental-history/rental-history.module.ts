import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// entity
import { RentalHistory } from './entities/rental-history.entity';

// services
import { RentalHistoryService } from './rental-history.service';

// controllers
import { RentalHistoryController } from './rental-history.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RentalHistory])],
  controllers: [RentalHistoryController],
  providers: [RentalHistoryService],
})
export class RentalHistoryModule {}
