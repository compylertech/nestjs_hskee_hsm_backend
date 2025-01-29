import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// entity
import { EntityCompany } from './entities/entity-company.entity';

// services
import { EntityCompanyService } from './entity-company.service';

// controllers
import { EntityCompanyController } from './entity-company.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EntityCompany])],
  controllers: [EntityCompanyController],
  providers: [EntityCompanyService],
})
export class EntityCompanyModule {}
