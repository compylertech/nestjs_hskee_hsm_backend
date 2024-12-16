import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';

// Constants
const CALENDAR_CLIENT = 'CALENDAR_CLIENT'; 

// Services
import { CalendarEventsService } from './calendar-event.service';

// Controllers
import { CalendarEventsController } from './calendar-event.controller';

// Config
import { ClientConfigModule, ClientConfigService } from 'apps/common/config';

@Module({
  imports: [ClientConfigModule],
  controllers: [CalendarEventsController],
  providers: [
    CalendarEventsService,
    {
      provide: CALENDAR_CLIENT,
      useFactory(configService: ClientConfigService) {
        const clientOptions = configService.formClientOptions; 
        return ClientProxyFactory.create(clientOptions);
      },
      inject: [ClientConfigService],
    },
  ],
  exports: [CalendarEventsService],
})
export class CalendarEventsModule {}
