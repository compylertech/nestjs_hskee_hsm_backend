import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// entity
import { Questionnaire } from './entities/questionnaire.entity';
import { EntityQuestionnaire } from '../entity_questionnaire/entities/entity-questionnaire.entity';

// services
import { QuestionnaireService } from './questionnaire.service';
import { EntityQuestionnaireService } from '../entity_questionnaire/entity-questionnaire.service';

// controllers
import { QuestionnaireController } from './questionnaire.controller';
import { Answer } from '../answers/entities/answer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Questionnaire, EntityQuestionnaire, Answer])],
  controllers: [QuestionnaireController],
  providers: [QuestionnaireService, EntityQuestionnaireService],
})
export class QuestionnaireModule {}
