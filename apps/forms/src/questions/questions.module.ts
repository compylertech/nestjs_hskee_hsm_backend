import { Module } from '@nestjs/common';

// services
import { QuestionsService } from './questions.service';

// controllers
import { QuestionsController } from './questions.controller';


@Module({
  controllers: [QuestionsController],
  providers: [QuestionsService],
})
export class QuestionsModule {}
