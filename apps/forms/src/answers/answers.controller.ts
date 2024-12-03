import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

// services
import { AnswersService } from './answers.service';

// contracts
import { CreateAnswerDto, UpdateAnswerDto, ANSWERS_PATTERNS } from '@app/contracts';

@Controller('answers')
export class AnswersController {
  constructor(private readonly answersService: AnswersService) {}

  @MessagePattern(ANSWERS_PATTERNS.CREATE)
  create(@Payload() createAnswerDto: CreateAnswerDto) {
    return this.answersService.create(createAnswerDto);
  }

  @MessagePattern(ANSWERS_PATTERNS.FIND_ALL)
  findAll() {
    return this.answersService.findAll();
  }

  @MessagePattern(ANSWERS_PATTERNS.FIND_ONE)
  findOne(@Payload() id: number) {
    return this.answersService.findOne(id);
  }

  @MessagePattern(ANSWERS_PATTERNS.UPDATE)
  update(@Payload() updateAnswerDto: UpdateAnswerDto) {
    return this.answersService.update(updateAnswerDto.id, updateAnswerDto);
  }

  @MessagePattern(ANSWERS_PATTERNS.REMOVE)
  remove(@Payload() id: number) {
    return this.answersService.remove(id);
  }
}
