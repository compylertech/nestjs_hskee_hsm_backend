import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

// constants
import { FORMS_CLIENT } from '../../../common/utils/constants';

// contracts
import {
  ANSWER_PATTERN,
  AnswerDto as ClientAnswerDto,
  CreateAnswerDto as ClientCreateAnswerDto,
  UpdateAnswerDto as ClientUpdateAnswerDto
} from '@app/contracts';

// dto
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';


@Injectable()
export class AnswerService {
  constructor(@Inject(FORMS_CLIENT) private readonly answerClient: ClientProxy) { }

  async create(createAnswerDto: CreateAnswerDto): Promise<ClientAnswerDto> {
    const createAnswerContract: CreateAnswerDto = { ...createAnswerDto };

    return this.answerClient.send<ClientAnswerDto, ClientCreateAnswerDto>(
      ANSWER_PATTERN.CREATE, createAnswerContract
    ).toPromise();
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<ClientAnswerDto[]> {
    return this.answerClient.send<ClientAnswerDto[]>(
      ANSWER_PATTERN.FIND_ALL,
      pageOptionsDto
    ).toPromise();
  }

  async findOne(answerId: string): Promise<ClientAnswerDto> {
    return this.answerClient
      .send<ClientAnswerDto>(ANSWER_PATTERN.FIND_ONE, answerId)
      .toPromise();
  }

  async update(answerId: string, updateAnswerDto: UpdateAnswerDto): Promise<ClientAnswerDto> {
    const updateAnswerContract: UpdateAnswerDto = { ...updateAnswerDto };

    return this.answerClient.send<ClientAnswerDto, ClientUpdateAnswerDto>(
      ANSWER_PATTERN.UPDATE,
      { answer_id: answerId, ...updateAnswerContract }
    ).toPromise();
  }

  async remove(answerId: string): Promise<void> {
    return this.answerClient.send<void>(
      ANSWER_PATTERN.REMOVE,
      answerId
    ).toPromise();
  }
}

