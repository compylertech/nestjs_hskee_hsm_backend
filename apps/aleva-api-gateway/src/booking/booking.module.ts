import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { ClientProxyFactory } from '@nestjs/microservices';

// constants
import { BOOKING } from 'apps/common/config/constants';
import { BOOKING_CLIENT } from '../common/utils/constants';

// config
import { ClientConfigModule, ClientConfigService } from '../../../common/config';

// services
import { BookingService } from './booking.service';

// controller
import { BookingController } from './booking.controller';

// helpers
import { appendSubPathsToBaseModule } from 'apps/common/utils/helpers';
@Module({
  imports: [
    ClientConfigModule, 
    RouterModule.register([
      {
        path: 'forms',
        children: [
          ...appendSubPathsToBaseModule('/', [ ]),
        ],
      },
    ]),
  ],
  controllers: [BookingController],
  providers: [BookingService,
    {
      provide: BOOKING_CLIENT,
      useFactory(configService: ClientConfigService) {
        const clientOptions = configService.getClientOptions(BOOKING);
        return ClientProxyFactory.create(clientOptions);
      },
      inject: [ClientConfigService]
    }],
})
export class BookingModule { }
