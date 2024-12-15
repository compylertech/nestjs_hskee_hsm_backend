import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

// constants
import { FORMS_CLIENT } from '../../../common/utils/constants';

// contracts
import {
  QUESTIONNAIRE_PATTERN,
  QuestionnaireDto as ClientQuestionnaireDto,
  CreateQuestionnaireDto as ClientCreateQuestionnaireDto,
  UpdateQuestionnaireDto as ClientUpdateQuestionnaireDto
} from '@app/contracts';

// dto
import { CreateQuestionnaireDto } from './dto/create-questionnaire.dto';
import { UpdateQuestionnaireDto } from './dto/update-questionnaire.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';


@Injectable()
export class QuestionnaireService {
  constructor(@Inject(FORMS_CLIENT) private readonly questionnaireClient: ClientProxy) { }

  async create(createQuestionnaireDto: CreateQuestionnaireDto): Promise<ClientQuestionnaireDto> {
    const createQuestionnaireContract: CreateQuestionnaireDto = { ...createQuestionnaireDto };

    return this.questionnaireClient.send<ClientQuestionnaireDto, ClientCreateQuestionnaireDto>(
      QUESTIONNAIRE_PATTERN.CREATE, createQuestionnaireContract
    ).toPromise();
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<ClientQuestionnaireDto[]> {
    return this.questionnaireClient.send<ClientQuestionnaireDto[]>(
      QUESTIONNAIRE_PATTERN.FIND_ALL,
      pageOptionsDto
    ).toPromise();
  }

  async findOne(questionnaireId: string): Promise<ClientQuestionnaireDto> {
    return this.questionnaireClient
      .send<ClientQuestionnaireDto>(QUESTIONNAIRE_PATTERN.FIND_ONE, questionnaireId)
      .toPromise();
  }

  async update(questionnaireId: string, updateQuestionnaireDto: UpdateQuestionnaireDto): Promise<ClientQuestionnaireDto> {
    const updateQuestionnaireContract: UpdateQuestionnaireDto = { ...updateQuestionnaireDto };

    return this.questionnaireClient.send<ClientQuestionnaireDto, ClientUpdateQuestionnaireDto>(
      QUESTIONNAIRE_PATTERN.UPDATE,
      { questionnaire_id: questionnaireId, ...updateQuestionnaireContract }
    ).toPromise();
  }

  async remove(questionnaireId: string): Promise<void> {
    return this.questionnaireClient.send<ClientQuestionnaireDto>(
      QUESTIONNAIRE_PATTERN.DELETE,
      questionnaireId
    ).toPromise();
  }
}

