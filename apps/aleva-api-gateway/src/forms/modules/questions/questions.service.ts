import { map } from 'rxjs';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

// constants
import { FORMS_CLIENT } from '../../../constants';

// contracts
import {
  QUESTIONS_PATTERNS,
  QuestionDto as ClientQuestionDto,
  CreateQuestionDto as ClientCreateQuestionDto,
  UpdateQuestionDto as ClientUpdateQuestionDto,
} from '@app/contracts';

// dto
import { QuestionDto } from './dto/question.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Injectable()
export class QuestionsService {
  constructor(@Inject(FORMS_CLIENT) private questionsClient: ClientProxy) {}

  private mapQuestionDto(questionDto: ClientQuestionDto): QuestionDto {
    return {
      id: questionDto.id,
      title: questionDto.title,
      author: questionDto.author,
      rating: questionDto.rating,
    };
  }

  create(createQuestionDto: CreateQuestionDto) {
    return this.questionsClient
      .send<ClientQuestionDto, ClientCreateQuestionDto>(
        QUESTIONS_PATTERNS.CREATE,
        createQuestionDto,
      )
      .pipe(map(this.mapQuestionDto));
  }

  findAll() {
    return this.questionsClient.send<ClientQuestionDto[]>(
      QUESTIONS_PATTERNS.FIND_ALL,
      {},
    );
  }

  findOne(id: number) {
    return this.questionsClient.send<ClientQuestionDto>(
      QUESTIONS_PATTERNS.FIND_ONE,
      { id },
    );
  }

  update(id: number, updateQuestionDto: UpdateQuestionDto) {
    return this.questionsClient
      .send<ClientQuestionDto, ClientUpdateQuestionDto>(
        QUESTIONS_PATTERNS.UPDATE,
        { id, ...updateQuestionDto },
      )
      .pipe(map(this.mapQuestionDto));
  }

  remove(id: number) {
    return this.questionsClient.send<ClientQuestionDto>(
      QUESTIONS_PATTERNS.REMOVE,
      { id },
    );
  }
}
