import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// entity
import { Unit } from './entities/unit.entity';

// services
import { UnitService } from './unit.service';

// controllers
import { UnitController } from './unit.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Unit])],
  controllers: [UnitController],
  providers: [UnitService],
})
export class UnitModule {}
