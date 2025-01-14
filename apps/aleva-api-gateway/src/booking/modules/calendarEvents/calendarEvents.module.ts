import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';

// constants
import { CALENDAREVENTS_CLIENT } from '../common/utils/constants';

// services
import { CalendarEventsService } from './calendarevents.service';

// controller
import { CalendarEventsController } from './calendarevents.controller';

// config
import { ClientConfigModule, ClientConfigService } from '../../../common/config';

@Module({
  imports: [ClientConfigModule],
  controllers: [CalendarEventsController],
  providers: [
    CalendarEventsService,
    {
      provide: CALENDAREVENTS_CLIENT,
      useFactory(configService: ClientConfigService) {
        const clientOptions = configService.calendareventsClientOptions;
        return ClientProxyFactory.create(clientOptions);
      },
      inject: [ClientConfigService]
    }
  ]
})
export class CalendarEventsModule {}
