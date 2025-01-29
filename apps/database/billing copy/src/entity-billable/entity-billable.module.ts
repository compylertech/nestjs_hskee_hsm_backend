import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// entity
import { EntityBillable } from './entities/entity-billable.entity';

// services
import { EntityBillableService } from './entity-billable.service';

// controllers
import { EntityBillableController } from './entity-billable.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EntityBillable])],
  controllers: [EntityBillableController],
  providers: [EntityBillableService],
})
export class EntityBillableModule {}
