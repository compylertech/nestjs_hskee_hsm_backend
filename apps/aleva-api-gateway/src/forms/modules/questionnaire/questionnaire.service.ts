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

// entity
import {
  EntityQuestionnaireDto as EntityQuestionnaireDto,
  CreateEntityQuestionnaireDto as ClientCreateEntityQuestionnaireDto,
  UpdateEntityQuestionnaireDto as ClientUpdateEntityQuestionnaireDto,
} from '@app/contracts';

import { UpdateEntityQuestionnaireDto } from './dto/update-entity-questionnaire.dto';
import { CreateEntityQuestionnaireDto } from './dto/create-entity-questionnaire.dto';

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
    return this.questionnaireClient.send<void>(
      QUESTIONNAIRE_PATTERN.DELETE,
      questionnaireId
    ).toPromise();
  }

  async createEntityQuestionnaire(
    createEntityQuestionnaireDto: CreateEntityQuestionnaireDto
  ): Promise<EntityQuestionnaireDto> {
    const createEntityQuestionnaireContract: ClientCreateEntityQuestionnaireDto = {
      ...createEntityQuestionnaireDto,
    };

    return this.questionnaireClient.send<EntityQuestionnaireDto, ClientCreateEntityQuestionnaireDto>(
      QUESTIONNAIRE_PATTERN.CREATE_ENTITY,
      createEntityQuestionnaireContract
    ).toPromise();
  }

  async updateEntityQuestionnaire(
    entityQuestionnaireId: string,
    updateEntityQuestionnaireDto: UpdateEntityQuestionnaireDto
  ): Promise<EntityQuestionnaireDto> {
    const updateEntityQuestionnaireContract: ClientUpdateEntityQuestionnaireDto = {
      ...updateEntityQuestionnaireDto,
    };

    return this.questionnaireClient.send<EntityQuestionnaireDto, ClientUpdateEntityQuestionnaireDto>(
      QUESTIONNAIRE_PATTERN.UPDATE_ENTITY,
      { entity_questionnaire_id: entityQuestionnaireId, ...updateEntityQuestionnaireContract }
    ).toPromise();
  }

}

