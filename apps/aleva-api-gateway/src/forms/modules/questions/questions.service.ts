import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

// constants
import { FORMS_CLIENT } from '../../../common/utils/constants';

// contracts
import {
  QUESTION_PATTERN,
  QuestionDto as ClientQuestionDto,
  CreateQuestionDto as ClientCreateQuestionDto,
  UpdateQuestionDto as ClientUpdateQuestionDto
} from '@app/contracts';

// dto
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';


@Injectable()
export class QuestionsService {
  constructor(@Inject(FORMS_CLIENT) private readonly questionsClient: ClientProxy) { }

  async create(createQuestionDto: CreateQuestionDto): Promise<ClientQuestionDto> {
    const createQuestionsContract: CreateQuestionDto = { ...createQuestionDto };

    return this.questionsClient.send<ClientQuestionDto, ClientCreateQuestionDto>(
      QUESTION_PATTERN.CREATE, createQuestionsContract
    ).toPromise();
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<ClientQuestionDto[]> {
    return this.questionsClient.send<ClientQuestionDto[]>(
      QUESTION_PATTERN.FIND_ALL,
      pageOptionsDto
    ).toPromise();
  }

  async findOne(questionsId: string): Promise<ClientQuestionDto> {
    return this.questionsClient
      .send<ClientQuestionDto>(QUESTION_PATTERN.FIND_ONE, questionsId)
      .toPromise();
  }

  async update(questionsId: string, updateQuestionDto: UpdateQuestionDto): Promise<ClientQuestionDto> {
    const updateQuestionsContract: UpdateQuestionDto = { ...updateQuestionDto };

    return this.questionsClient.send<ClientQuestionDto, ClientUpdateQuestionDto>(
      QUESTION_PATTERN.UPDATE,
      { question_id: questionsId, ...updateQuestionsContract }
    ).toPromise();
  }

  async remove(questionsId: string): Promise<void> {
    return this.questionsClient.send<ClientQuestionDto>(
      QUESTION_PATTERN.DELETE,
      questionsId
    ).toPromise();
  }
}

