import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaintenanceRequest } from '../maintenance-request/entities/entity';
import { MaintenanceRequestService } from './maintenance-request.service';
import { MaintenanceRequestController } from './maintenance-request.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MaintenanceRequest])],
  providers: [MaintenanceRequestService],
  controllers: [MaintenanceRequestController],
  exports: [MaintenanceRequestService],
})
export class MaintenanceRequestModule {}
