import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// entity
import { Answer } from './entities/answer.entity';

// services
import { AnswerService } from './answers.service';

// controllers
import { AnswerController } from './answers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Answer])],
  controllers: [AnswerController],
  providers: [AnswerService],
})
export class AnswersModule {}
