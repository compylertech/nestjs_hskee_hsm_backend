import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// entity
import { EntityAddress } from './entities/entity-address.entity';

// services
import { EntityAddressService } from './entity-address.service';

// controllers
import { EntityAddressController } from './entity-address.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EntityAddress])],
  controllers: [EntityAddressController],
  providers: [EntityAddressService],
})
export class EntityAddressModule {}
