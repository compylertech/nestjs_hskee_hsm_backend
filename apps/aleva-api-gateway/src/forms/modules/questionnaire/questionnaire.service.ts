import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

// constants
import { FORMS_CLIENT, RBAC_CLIENT } from '../../../common/utils/constants';

// contracts
import {
  QUESTIONNAIRE_PATTERN, ENTITY_QUESTIONNAIRE_PATTERN,
  QuestionnaireDto as ClientQuestionnaireDto,
  CreateQuestionnaireDto as ClientCreateQuestionnaireDto,
  UpdateQuestionnaireDto as ClientUpdateQuestionnaireDto,
  UserBaseDto,
  USERS_PATTERNS
} from '@app/contracts';

// dto
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';
import { CreateQuestionnaireDto } from './dto/create-questionnaire.dto';
import { UpdateQuestionnaireDto } from './dto/update-questionnaire.dto';
import { PageDto } from 'apps/common/dto/page.dto';
import { QuestionnaireResponse } from './interfaces/questionnaire.interface';

@Injectable()
export class QuestionnaireService {
  constructor(
    @Inject(FORMS_CLIENT) private readonly questionnaireClient: ClientProxy,
    @Inject(RBAC_CLIENT) private readonly usersClient: ClientProxy
  ) { }

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

  async fetchGroupedQuestionnaireData(pageOptionsDto: PageOptionsDto, entityId?: string[]): Promise<PageDto<any[]>> {
    // Fetch questionnaire responses
    const responses = await this.questionnaireClient
      .send<PageDto<QuestionnaireResponse>, { pageOptionsDto: PageOptionsDto; entityId?: string[] }>(
        QUESTIONNAIRE_PATTERN.GET_ENTITY_RESPONSES,
        { pageOptionsDto, entityId }
      )
      .toPromise();
  
    if (!responses?.data?.length) {
      return responses;
    }
  
    // Extract unique user IDs
    const userIds = [...new Set(responses.data.map(item => item.user_id))];
  
    if (userIds.length) {
      // Fetch related users in parallel
      const relatedUsers = await this.fetchRelatedUsers(userIds as string[]);
  
      const userMap = new Map(relatedUsers.map(user => [user.user_id, user]));
  
      // Map responses with related user info and create a new PageDto
      const updatedData = responses.data.map(user => ({
        ...user,
        user: userMap.get(user.user_id) || null,
      }));
  
      return { ...responses, data: updatedData };
    }
  
    return responses;
  }
  
  // Communicate with users microservice
  private async fetchRelatedUsers(userIds: string[]): Promise<UserBaseDto[]> {
    if (!userIds?.length) {
      return [];
    }
  
    return this.usersClient
      .send<UserBaseDto[], string[]>(USERS_PATTERNS.FETCH_RELATION_USERS, userIds)
      .toPromise();
  }
  


  async findOne(questionnaireId: string): Promise<ClientQuestionnaireDto> {
    return await this.questionnaireClient
      .send<ClientQuestionnaireDto>(QUESTIONNAIRE_PATTERN.FIND_ONE, questionnaireId)
      .toPromise();
  }

  async update(questionnaireId: string, updateQuestionnaireDto: UpdateQuestionnaireDto): Promise<ClientQuestionnaireDto> {
    const updateQuestionnaireContract: UpdateQuestionnaireDto = { ...updateQuestionnaireDto };

    return await this.questionnaireClient.send<ClientQuestionnaireDto, ClientUpdateQuestionnaireDto>(
      QUESTIONNAIRE_PATTERN.UPDATE,
      { questionnaire_id: questionnaireId, ...updateQuestionnaireContract }
    ).toPromise();
  }

  async remove(questionnaireId: string): Promise<void> {
    return await this.questionnaireClient.send<void>(
      QUESTIONNAIRE_PATTERN.DELETE,
      questionnaireId
    ).toPromise();
  }

  async removeEntityQuestionnaireResponse(questionnaireId: string): Promise<void> {
    return await this.questionnaireClient.send<void>(
      ENTITY_QUESTIONNAIRE_PATTERN.DELETE,
      questionnaireId
    ).toPromise();
  }


}