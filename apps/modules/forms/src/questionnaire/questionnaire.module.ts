import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// entity
import { Questionnaire } from './entities/questionnaire.entity';

// services
import { QuestionnaireService } from './questionnaire.service';

// controllers
import { QuestionnaireController } from './questionnaire.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Questionnaire])],
  controllers: [QuestionnaireController],
  providers: [QuestionnaireService],
})
export class QuestionnaireModule {}
