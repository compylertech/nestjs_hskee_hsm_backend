import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// entity
import { Address } from './entities/address.entity';
import { EntityAddress } from '../entity-address/entities/entity-address.entity';

// services
import { AddressService } from './address.service';

// controllers
import { AddressController } from './address.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Address, EntityAddress])],
  controllers: [AddressController],
  providers: [AddressService],
})
export class AddressModule {}
