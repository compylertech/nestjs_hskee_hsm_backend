import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { ClientProxyFactory } from '@nestjs/microservices';

// constants
import { ADDRESS } from 'apps/common/config/constants';
import { ADDRESS_CLIENT } from '../common/utils/constants';

// config
import { ClientConfigModule, ClientConfigService } from '../../../common/config';

// services
import { AddressService } from './address.service';

// controller
import { AddressController } from './address.controller';

// module
import { AddressModule } from './modules/address/address.module';

// helpers
import { appendSubPathsToBaseModule } from 'apps/common/utils/helpers';

@Module({
  imports: [
    ClientConfigModule, 
    AddressModule,
    RouterModule.register([
      {
        path: '',
        children: [
          ...appendSubPathsToBaseModule('/', [AddressModule]),
        ],
      },
    ]),
  ],
  controllers: [AddressController],
  providers: [AddressService,
    {
      provide: ADDRESS_CLIENT,
      useFactory(configService: ClientConfigService) {
        const clientOptions = configService.getClientOptions(ADDRESS);
        return ClientProxyFactory.create(clientOptions);
      },
      inject: [ClientConfigService]
    }],
})
export class AddressAppModule { }
