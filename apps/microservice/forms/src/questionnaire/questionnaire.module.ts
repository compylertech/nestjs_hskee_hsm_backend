import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// entity
import { Questionnaire } from './entities/questionnaire.entity';
import { EntityQuestionnaire } from './entities/entity-questionnaire.entity';

// services
import { QuestionnaireService } from './questionnaire.service';

// controllers
import { QuestionnaireController } from './questionnaire.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Questionnaire, EntityQuestionnaire])],
  controllers: [QuestionnaireController],
  providers: [QuestionnaireService],
})
export class QuestionnaireModule {}
