import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';

// constants
import { ADDRESS_CLIENT } from '../common/utils/constants';

// services
import { AddressService } from './address.service';

// controller
import { AddressController } from './address.controller';

// config
import { ClientConfigModule, ClientConfigService } from '../../../common/config';

@Module({
  imports: [ClientConfigModule],
  controllers: [AddressController],
  providers: [
    AddressService,
    {
      provide: ADDRESS_CLIENT,
      useFactory(configService: ClientConfigService) {
        const clientOptions = configService.addressClientOptions;
        return ClientProxyFactory.create(clientOptions);
      },
      inject: [ClientConfigService]
    }
  ]
})
export class AddressModule {}
