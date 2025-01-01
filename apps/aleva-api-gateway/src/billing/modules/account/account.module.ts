import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';

// constants
import { BILLING } from 'apps/common/config/constants';
import { BILLING_CLIENT } from '../../../common/utils/constants';

// services
import { AccountService } from './account.service';

// controller
import { AccountController } from './account.controller';

// config
import { ClientConfigModule, ClientConfigService } from '../../../../../common/config';


@Module({
  imports: [ClientConfigModule],
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
  ]
})
export class AccountModule {}
