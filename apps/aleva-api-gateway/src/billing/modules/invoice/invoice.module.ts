import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';

// constants
import { BILLING } from 'apps/common/config/constants';
import { BILLING_CLIENT } from '../../../common/utils/constants';

// config
import { ClientConfigModule, ClientConfigService } from 'apps/common/config';

// services
import { InvoiceService } from './invoice.service';

// controller
import { InvoiceController } from './invoice.controller';

@Module({
  imports: [ClientConfigModule],
  controllers: [InvoiceController],
  providers: [
    InvoiceService,
    {
      provide: BILLING_CLIENT,
      useFactory(configService: ClientConfigService) {
        const clientOptions = configService.getClientOptions(BILLING);
        return ClientProxyFactory.create(clientOptions);
      },
      inject: [ClientConfigService],
    },
  ],
})
export class InvoiceModule {}
