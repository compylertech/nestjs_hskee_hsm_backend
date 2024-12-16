import { Module } from '@nestjs/common';
import { ClientConfigModule } from 'apps/common/config';

// modules
// import { QuestionsModule } from './reservation/questions.module'; // TODO: REMOVE AND ADD YOUR CALENDAR_EVENT MODULE HERE

@Module({
  imports: [
    // QuestionsModule, // TODO: REMOVE AND ADD YOUR CALENDAR_EVENT MODULE HERE
    ClientConfigModule
  ],
  controllers: [],
  providers: [],
})
export class BookingAppModule {}
