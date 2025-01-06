import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// entity
import { Question } from './entities/questions.entity';
import { EntityQuestionnaire } from '../entity_questionnaire/entities/entity-questionnaire.entity';

// services
import { QuestionsService } from './questions.service';
import { EntityQuestionnaireService } from '../entity_questionnaire/entity-questionnaire.service';

// controllers
import { QuestionsController } from './questions.controller';
import { Answer } from '../answers/entities/answer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Question, EntityQuestionnaire, Answer])],
  controllers: [QuestionsController],
  providers: [QuestionsService, EntityQuestionnaireService],
})
export class QuestionsModule {}
