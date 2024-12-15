import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// entity
import { Attendance_log } from './entities/attendance_log.entity';

// services
import { Attendance_logService } from './attendance_log.service';

// controllers
import { Attendance_logController } from './attendance_log.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Attendance_log])],
  controllers: [Attendance_logController],
  providers: [Attendance_logService],
})
export class Attendance_logModule {}
