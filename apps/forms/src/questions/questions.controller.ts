import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

// services
import { QuestionsService } from './questions.service';

// contracts
import { CreateQuestionDto, UpdateQuestionDto, QUESTIONS_PATTERNS } from '@app/contracts';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @MessagePattern(QUESTIONS_PATTERNS.CREATE)
  create(@Payload() createQuestionDto: CreateQuestionDto) {
    return this.questionsService.create(createQuestionDto);
  }

  @MessagePattern(QUESTIONS_PATTERNS.FIND_ALL)
  findAll() {
    return this.questionsService.findAll();
  }

  @MessagePattern(QUESTIONS_PATTERNS.FIND_ONE)
  findOne(@Payload() id: number) {
    return this.questionsService.findOne(id);
  }

  @MessagePattern(QUESTIONS_PATTERNS.UPDATE)
  update(@Payload() updateQuestionDto: UpdateQuestionDto) {
    return this.questionsService.update(updateQuestionDto.id, updateQuestionDto);
  }

  @MessagePattern(QUESTIONS_PATTERNS.REMOVE)
  remove(@Payload() id: number) {
    return this.questionsService.remove(id);
  }
}
