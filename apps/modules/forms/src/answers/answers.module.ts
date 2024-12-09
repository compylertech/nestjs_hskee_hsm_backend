import { Module } from '@nestjs/common';

// services
import { AnswersService } from './answers.service';

// controllers
import { AnswersController } from './answers.controller';

@Module({
  controllers: [AnswersController],
  providers: [AnswersService],
})
export class AnswersModule {}
