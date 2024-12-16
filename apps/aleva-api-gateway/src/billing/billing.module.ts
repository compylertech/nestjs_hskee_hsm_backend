import { Module, Type } from '@nestjs/common';
import { RouterModule, RouteTree } from '@nestjs/core';
import { Controller } from '@nestjs/common/interfaces';
import { ClientProxyFactory } from '@nestjs/microservices';

// constants
import { BILLING_CLIENT } from '../common/utils/constants';

// services
import { BillingService } from './billing.service';

// controller
import { BillingController } from './billing.controller';

// module
import { InvoiceModule } from './modules/invoice/invoice.module';

// config
import { ClientConfigModule, ClientConfigService } from '../../../common/config';


function appendSubPathsToBaseModule(basePath: string, controllers: Type<Controller>[]): RouteTree[] {
  return controllers.map((controller) => {
    const controllerPath = Reflect.getMetadata('path', controller);

    return {
      path: `${basePath}`,
      module: controller as Type<Controller>,
    };
  });
}

@Module({
  imports: [
    ClientConfigModule, 
    InvoiceModule,
    RouterModule.register([
      {
        path: 'billing',
        children: [
          ...appendSubPathsToBaseModule('/', [InvoiceModule]),
        ],
      },
    ]),
  ],
  controllers: [BillingController],
  providers: [BillingService,
    {
      provide: BILLING_CLIENT,
      useFactory(configService: ClientConfigService) {
        const clientOptions = configService.billingClientOptions;
        return ClientProxyFactory.create(clientOptions);
      },
      inject: [ClientConfigService]
    }],
})
export class BillingModule { }
