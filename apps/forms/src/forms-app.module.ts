import { Module } from '@nestjs/common';
import { QuestionsModule } from './questions/questions.module';
import { ClientConfigModule } from 'apps/common/config';
import { AnswersModule } from './answers/answers.module';

@Module({
  imports: [QuestionsModule, AnswersModule, ClientConfigModule],
  controllers: [],
  providers: [],
})
export class FormsAppModule {}
