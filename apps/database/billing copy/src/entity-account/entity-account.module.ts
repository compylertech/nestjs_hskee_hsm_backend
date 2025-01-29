import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// entity
import { EntityAccount } from './entities/entity-account.entity';

// services
import { EntityAccountService } from './entity-account.service';

// controllers
import { EntityAccountController } from './entity-account.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EntityAccount])],
  controllers: [EntityAccountController],
  providers: [EntityAccountService],
})
export class EntityAccountModule {}
