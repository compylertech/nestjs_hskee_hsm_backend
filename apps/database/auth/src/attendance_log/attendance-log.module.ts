import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// entity
import { AttendanceLog } from './entities/attendance-log.entity';

// services
import { AttendanceLogService } from './attendance-log.service';

// controllers
import { AttendanceLogController } from './attendance-log.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AttendanceLog])],
  controllers: [AttendanceLogController],
  providers: [AttendanceLogService],
})
export class AttendanceLogModule {}
