import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// entity
import { Account } from './entities/account.entity';
import { EntityAccount } from '../entity-account/entities/entity-account.entity';
import { EntityBillable } from '../entity-billable/entities/entity-billable.entity';

// services
import { AccountService } from './account.service';

// controllers
import { AccountController } from './account.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Account, EntityAccount, EntityBillable])],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
