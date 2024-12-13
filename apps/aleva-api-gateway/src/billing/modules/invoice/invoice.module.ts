import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';

// constants
import { BILLING_CLIENT } from '../../../common/utils/constants';

// services
import { InvoiceService } from './invoice.service';

// controller
import { InvoiceController } from './invoice.controller';

// config
import { ClientConfigModule, ClientConfigService } from 'apps/common/config';

@Module({
  imports: [ClientConfigModule],
  controllers: [InvoiceController],
  providers: [
    InvoiceService,
    {
      provide: BILLING_CLIENT,
      useFactory(configService: ClientConfigService) {
        const clientOptions = configService.billingClientOptions;
        return ClientProxyFactory.create(clientOptions);
      },
      inject: [ClientConfigService],
    },
  ],
})
export class InvoiceModule {}
