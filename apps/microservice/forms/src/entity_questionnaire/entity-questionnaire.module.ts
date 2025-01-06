import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// entity
import { Answer } from '../answers/entities/answer.entity';
import { EntityQuestionnaire } from './entities/entity-questionnaire.entity';

// services
import { EntityQuestionnaireService } from './entity-questionnaire.service';

// controllers
import { EntityQuestionnaireController } from './entity-questionnaire.controller';


@Module({
  imports: [TypeOrmModule.forFeature([EntityQuestionnaire, Answer])],
  controllers: [EntityQuestionnaireController],
  providers: [EntityQuestionnaireService],
  exports: [EntityQuestionnaireService]
})

export class EntityQuestionnaireModule {}