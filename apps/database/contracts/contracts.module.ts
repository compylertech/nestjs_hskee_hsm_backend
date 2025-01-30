import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contract } from './entities/entity';
import { ContractService } from './contracts.service';
import { ContractController } from './contracts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Contract])],
  providers: [ContractService],
  controllers: [ContractController],
  exports: [ContractService],
})
export class ContractModule {}
