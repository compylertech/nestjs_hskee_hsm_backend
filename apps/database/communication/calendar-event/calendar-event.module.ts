import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarEvent } from './entitites/entity';
import { CalendarEventService } from './calendar-event.service';
import { CalendarEventController } from './calendar-events.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CalendarEvent])],
  providers: [CalendarEventService],
  controllers: [CalendarEventController],
  exports: [CalendarEventService],
})
export class CalendarEventModule {}
