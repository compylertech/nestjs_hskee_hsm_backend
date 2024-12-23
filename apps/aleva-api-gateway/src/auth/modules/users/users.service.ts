import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

// constants
import { FORMS_CLIENT, RBAC_CLIENT } from '../../../common/utils/constants';

// contracts
import {
  USERS_PATTERNS,
  UserDto as ClientUserDto,
  CreateUserDto as ClientCreateUserDto,
  UpdateUserDto as ClientUpdateUserDto,

  QUESTIONNAIRE_PATTERN,
  ENTITY_QUESTIONNAIRE_PATTERN,
  EntityQuestionnaireDto as EntityQuestionnaireDto,
  CreateEntityQuestionnaireDto as ClientCreateEntityQuestionnaireDto,
} from '@app/contracts';

// dto
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';
import { CreateEntityQuestionnaireDto } from '../../../forms//modules/questionnaire/dto/create-entity-questionnaire.dto';


// pipes
import { transformGatewayUserDto } from './pipes/user-transform.pipe';

@Injectable()
export class UsersService {
  constructor(
    @Inject(RBAC_CLIENT) private rbacClient: ClientProxy,
    @Inject(FORMS_CLIENT) private formsClient: ClientProxy
  ) { }

  async create(createUserDto: CreateUserDto) {
    const transformedDto = transformGatewayUserDto(createUserDto);
    return await this.rbacClient
      .send<ClientUserDto, ClientCreateUserDto>(
        USERS_PATTERNS.CREATE, transformedDto
      ).toPromise();
  }

  async findAll(pageOptionsDto: PageOptionsDto) {
    const userResponses = await this.rbacClient.send<ClientUserDto[]>(
      USERS_PATTERNS.FIND_ALL,
      pageOptionsDto,
    ).toPromise();

    // fetch answers for each userResponse
    await Promise.all(
      userResponses["data"].map((userResponse) =>
        this.appendUserResponseWithAnswers(userResponse, pageOptionsDto),
      ),
    );

    return userResponses
  }

  async findOne(id: string) {
    const userResponse =  await this.rbacClient.send<ClientUserDto>(
      USERS_PATTERNS.FIND_ONE,
      id
    ).toPromise();

    // fetch answers for each userResponse
    await Promise.all(
      [userResponse].map((userResponse) =>
        this.appendUserResponseWithAnswers(userResponse, new PageOptionsDto()),
      ),
    );
    return userResponse;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const transformedDto = transformGatewayUserDto(updateUserDto);

    // update users 
    const user = await this.rbacClient.send<ClientUserDto, ClientUpdateUserDto>(
      USERS_PATTERNS.UPDATE,
      { user_id: id, ...transformedDto }
    ).toPromise();

    // fetch answers from the forms microservice
    const answers = await this.createEntityQuestionnaire(updateUserDto.answers)

    return {
      ...user,
      answers: answers
    }
  }

  async remove(id: string): Promise<void> {
    return await this.rbacClient.send<void>(
      USERS_PATTERNS.REMOVE,
      id
    ).toPromise();;
  }

  // communicate with forms microservice
  private async createEntityQuestionnaire(
    createEntityQuestionnaireDto: CreateEntityQuestionnaireDto[]
  ): Promise<EntityQuestionnaireDto> {

    return await this.formsClient.send<EntityQuestionnaireDto, ClientCreateEntityQuestionnaireDto[]>(
      ENTITY_QUESTIONNAIRE_PATTERN.CREATE,
      createEntityQuestionnaireDto
    ).toPromise();
  }

  private async appendUserResponseWithAnswers(userResponse: ClientUserDto, pageOptionsDto: PageOptionsDto): Promise<ClientUserDto> {
    const userId = userResponse.user_id;

    try {
      const userAnswers = await this.formsClient
        .send<any[]>(QUESTIONNAIRE_PATTERN.GET_ENTITY_RESPONSES, {
          pageOptionsDto,
          entityId: [userId],
        })
        .toPromise();

      if (
        userAnswers &&
        userAnswers["data"] &&
        Array.isArray(userAnswers["data"]) &&
        userAnswers["data"].length > 0 &&
        userAnswers["data"][0]["questionnaires"]
      ) {
        userResponse.answers = userAnswers["data"][0]["questionnaires"];
      } else {
        userResponse.answers = [];
      }
    } catch (error) {
      console.error(`Failed to fetch answers for user_id: ${userId}`, error);
      userResponse.answers = [];
    }

    return userResponse;
  }
}
