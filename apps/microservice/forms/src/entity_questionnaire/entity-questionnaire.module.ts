import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// entity
import { EntityQuestionnaire } from './entities/entity-questionnaire.entity';

// services
import { EntityQuestionnaireService } from './entity-questionnaire.service';

// controllers
import { EntityQuestionnaireController } from './entity-questionnaire.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EntityQuestionnaire])],
  controllers: [EntityQuestionnaireController],
  providers: [EntityQuestionnaireService],
})

export class EntityQuestionnaireModule {}