import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';

// constants
import { ADDRESS, BILLING } from 'apps/common/config/constants';
import { ADDRESS_CLIENT, BILLING_CLIENT } from '../../../common/utils/constants';

// services
import { AccountService } from './account.service';

// controller
import { AccountController } from './account.controller';

// config
import { ClientConfigModule, ClientConfigService } from '../../../../../common/config';

// module
import { AddressModule } from 'apps/aleva-api-gateway/src/address/modules/address/address.module';


@Module({
  imports: [ClientConfigModule, AddressModule],
  controllers: [AccountController],
  providers: [
    AccountService,
    {
      provide: BILLING_CLIENT,
      useFactory(configService: ClientConfigService) {
        const clientOptions = configService.getClientOptions(BILLING);
        return ClientProxyFactory.create(clientOptions);
      },
      inject: [ClientConfigService]
    }
  ],
  exports: [AccountService]
})
export class AccountModule {}
