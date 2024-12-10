import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';

// constants
import { [MODULE]_CLIENT } from '../common/utils/constants';

// services
import { [Module]Service } from './[module].service';

// controller
import { [Module]Controller } from './[module].controller';

// config
import { ClientConfigModule, ClientConfigService } from '../../../common/config';

@Module({
  imports: [ClientConfigModule],
  controllers: [[Module]Controller],
  providers: [
    [Module]Service,
    {
      provide: [MODULE]_CLIENT,
      useFactory(configService: ClientConfigService) {
        const clientOptions = configService.[module]ClientOptions;
        return ClientProxyFactory.create(clientOptions);
      },
      inject: [ClientConfigService]
    }
  ]
})
export class [Module]Module {}
