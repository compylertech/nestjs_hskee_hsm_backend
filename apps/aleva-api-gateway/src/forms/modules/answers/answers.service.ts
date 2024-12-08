import { map } from 'rxjs';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

// constants
import { FORMS_CLIENT } from '../../../common/utils/constants';

// contracts
import {
  ANSWERS_PATTERNS,
  AnswerDto as ClientAnswerDto,
  CreateAnswerDto as ClientCreateAnswerDto,
  UpdateAnswerDto as ClientUpdateAnswerDto
} from '@app/contracts';

// dto
import { AnswerDto } from './dto/answer.dto';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';

@Injectable()
export class AnswersService {
  constructor(@Inject(FORMS_CLIENT) private answersClient: ClientProxy) {}

  private mapAnswerDto(answerDto: ClientAnswerDto): AnswerDto {
    return {
      id: answerDto.id,
      content: answerDto.content,
      questionId: answerDto.questionId,
      author: answerDto.author,
      likes: answerDto.likes,
    };
  }

  create(createAnswerDto: CreateAnswerDto) {
    return this.answersClient
      .send<ClientAnswerDto, ClientCreateAnswerDto>(
        ANSWERS_PATTERNS.CREATE,
        createAnswerDto
      )
      .pipe(map(this.mapAnswerDto));
  }

  findAll() {
    return this.answersClient.send<ClientAnswerDto[]>(
      ANSWERS_PATTERNS.FIND_ALL,
      {}
    );
  }

  findOne(id: number) {
    return this.answersClient.send<ClientAnswerDto>(
      ANSWERS_PATTERNS.FIND_ONE,
      { id }
    );
  }

  update(id: number, updateAnswerDto: UpdateAnswerDto) {
    return this.answersClient
      .send<ClientAnswerDto, ClientUpdateAnswerDto>(
        ANSWERS_PATTERNS.UPDATE,
        { id, ...updateAnswerDto }
      )
      .pipe(map(this.mapAnswerDto));
  }

  remove(id: number) {
    return this.answersClient.send<ClientAnswerDto>(
      ANSWERS_PATTERNS.REMOVE,
      { id }
    );
  }
}
