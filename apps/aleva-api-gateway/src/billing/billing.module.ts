import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { ClientProxyFactory } from '@nestjs/microservices';

// constants
import { BILLING } from 'apps/common/config/constants';
import { BILLING_CLIENT } from '../common/utils/constants';

// config
import { ClientConfigModule, ClientConfigService } from '../../../common/config';

// services
import { BillingService } from './billing.service';

// controller
import { BillingController } from './billing.controller';

// module
import { AccountModule } from './modules/account/account.module';
import { InvoiceModule } from './modules/invoice/invoice.module';

// helpers
import { appendSubPathsToBaseModule } from 'apps/common/utils/helpers';

@Module({
  imports: [
    ClientConfigModule, 
    AccountModule,
    InvoiceModule,
    RouterModule.register([
      {
        path: 'billing',
        children: [
          ...appendSubPathsToBaseModule('/', [InvoiceModule, AccountModule]),
        ],
      }
    ]),
  ],
  controllers: [BillingController],
  providers: [BillingService,
    {
      provide: BILLING_CLIENT,
      useFactory(configService: ClientConfigService) {
        const clientOptions = configService.getClientOptions(BILLING);
        return ClientProxyFactory.create(clientOptions);
      },
      inject: [ClientConfigService]
    }],
})
export class BillingModule { }
