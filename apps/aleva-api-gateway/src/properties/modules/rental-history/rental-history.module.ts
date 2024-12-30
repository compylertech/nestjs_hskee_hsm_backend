import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';

// constants
import { RENTAL-HISTORY_CLIENT } from '../common/utils/constants';

// services
import { Rental-historyService } from './rental-history.service';

// controller
import { Rental-historyController } from './rental-history.controller';

// config
import { ClientConfigModule, ClientConfigService } from '../../../common/config';

@Module({
  imports: [ClientConfigModule],
  controllers: [Rental-historyController],
  providers: [
    Rental-historyService,
    {
      provide: RENTAL-HISTORY_CLIENT,
      useFactory(configService: ClientConfigService) {
        const clientOptions = configService.rental-historyClientOptions;
        return ClientProxyFactory.create(clientOptions);
      },
      inject: [ClientConfigService]
    }
  ]
})
export class Rental-historyModule {}
