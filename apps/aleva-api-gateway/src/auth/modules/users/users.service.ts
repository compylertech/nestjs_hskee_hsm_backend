import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

// constants
import { FORMS_CLIENT, MAIL_CLIENT, RBAC_CLIENT } from '../../../common/utils/constants';

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
  EntityMediaTypeEnum,
  EntityAddressTypeEnum,
  OnboardingMailDto,
  MAIL_PATTERN,
  WelcomeMailDto,
} from '@app/contracts';

// dto
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';
import { CreateEntityQuestionnaireDto } from '../../../forms//modules/questionnaire/dto/create-entity-questionnaire.dto';

// pipes
import { transformGatewayUserDto } from './pipes/user-transform.pipe';

// services
import { BaseService } from 'apps/aleva-api-gateway/src/common/service/base.service';
import { MediaService } from 'apps/aleva-api-gateway/src/resources/modules/media/media.service';
import { AddressService } from 'apps/aleva-api-gateway/src/address/modules/address/address.service';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService extends BaseService<
  EntityMediaTypeEnum | EntityAddressTypeEnum,
  CreateUserDto,
  UpdateUserDto,
  ClientUserDto,
  ClientCreateUserDto,
  ClientUpdateUserDto,
  null,
  null
> {

  private readonly entityIdKey = 'user_id';

  constructor(
    private readonly mediaService: MediaService,
    private readonly addressService: AddressService,
    @Inject(RBAC_CLIENT) private rbacClient: ClientProxy,
    @Inject(FORMS_CLIENT) private formsClient: ClientProxy,
    @Inject(MAIL_CLIENT) private mailClient: ClientProxy
  ) {
    super(
      'user_id',
      rbacClient,
      {
        ...USERS_PATTERNS,
        LINK_ENTITY: '',
        DELETE_BY_ENTITY: ''
      },
      null,
      [
        {
          service: mediaService,
          entityType: EntityMediaTypeEnum.USER,
          mapKey: 'media',
        },
        {
          service: addressService,
          entityType: EntityAddressTypeEnum.USER,
          mapKey: 'address',
        },
      ]
    );
  }

  // constructor(
  //   @Inject(RBAC_CLIENT) private rbacClient: ClientProxy,
  //   @Inject(FORMS_CLIENT) private formsClient: ClientProxy
  // ) { }

  // async create(createUserDto: CreateUserDto) {
  //   const transformedDto = transformGatewayUserDto(createUserDto);
  //   return await this.rbacClient
  //     .send<ClientUserDto, ClientCreateUserDto>(
  //       USERS_PATTERNS.CREATE, transformedDto
  //     ).toPromise();
  // }

  async create(createDto: CreateUserDto): Promise<ClientUserDto> {
    const { media, address, ...createUserDtoContract } = createDto;
    const transformedDto = transformGatewayUserDto(createUserDtoContract);

    // create the entity
    const entityResponse = await this.rbacClient
      .send<ClientUserDto, ClientCreateUserDto>(USERS_PATTERNS.CREATE, transformedDto)
      .toPromise();

    const fieldResponses = await this.createEntityFields(entityResponse[this.entityIdKey], createDto);

    // merge all responses
    return { ...entityResponse, ...fieldResponses };
  }


  // async findAll(pageOptionsDto: PageOptionsDto) {
  //   const userResponses = await this.rbacClient.send<ClientUserDto[]>(
  //     USERS_PATTERNS.FIND_ALL,
  //     pageOptionsDto,
  //   ).toPromise();

  // // fetch answers for each userResponse
  // await Promise.all(
  //   userResponses["data"].map((userResponse) =>
  //     this.appendUserResponseWithAnswers(userResponse, pageOptionsDto),
  //   ),
  // );

  //   return userResponses
  // }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<ClientUserDto[]> {
    const entityResponse = await this.rbacClient.send<ClientUserDto[]>(
      USERS_PATTERNS.FIND_ALL,
      pageOptionsDto
    ).toPromise();

    // fetch answers for each userResponse
    await Promise.all(
      entityResponse["data"].map((userResponse) =>
        this.appendUserResponseWithAnswers(userResponse, pageOptionsDto),
      ),
    );

    const mappedData = await this.fetchAndMap(entityResponse["data"], this.entityIdKey);

    return { ...entityResponse, ...mappedData };
  }

  // async findOne(id: string) {
  //   const userResponse = await this.rbacClient.send<ClientUserDto>(
  //     USERS_PATTERNS.FIND_ONE,
  //     id
  //   ).toPromise();

  // fetch answers for each userResponse
  // await Promise.all(
  //   [userResponse].map((userResponse) =>
  //     this.appendUserResponseWithAnswers(userResponse, new PageOptionsDto()),
  //   ),
  // );
  // return userResponse;
  // }

  async findOne(userID: string): Promise<ClientUserDto> {
    const userResponse = await this.rbacClient
      .send<ClientUserDto>(USERS_PATTERNS.FIND_ONE, userID)
      .toPromise();

    // fetch answers for each userResponse
    await Promise.all(
      [userResponse].map((userResponse) =>
        this.appendUserResponseWithAnswers(userResponse, new PageOptionsDto()),
      ),
    );

    const mappedData = await this.fetchAndMap([userResponse], this.entityIdKey);

    return { ...mappedData[0] };
  }

  async findByEmail(email: string): Promise<ClientUserDto> {
    const userResponse = await this.rbacClient
      .send<ClientUserDto>(USERS_PATTERNS.FIND_ONE_EMAIL, email)
      .toPromise();

    return userResponse;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { media, address, ...updateEntityContract } = updateUserDto;
    const transformedDto = transformGatewayUserDto(updateEntityContract);

    // update users 
    // const user = await this.rbacClient.send<ClientUserDto, ClientUpdateUserDto>(
    //   USERS_PATTERNS.UPDATE,
    //   { user_id: id, ...transformedDto }
    // ).toPromise();
    const user = await this.updateEntityFields(id, updateUserDto, transformedDto);
    // fetch answers from the forms microservice
    const answers = updateUserDto.answers ? await this.createEntityQuestionnaire(updateUserDto.answers) : [];

    return {
      ...user,
      answers: answers
    }
  }

  async remove(id: string): Promise<void> {
    // return await this.rbacClient.send<void>(
    //   USERS_PATTERNS.REMOVE,
    //   id
    // ).toPromise();;
    await this.removeEntityFields(id);

  }

  // communicate with forms microservice
  private async createEntityQuestionnaire(
    createEntityQuestionnaireDto: CreateEntityQuestionnaireDto[]
  ): Promise<EntityQuestionnaireDto[]> {

    return await this.formsClient.send<EntityQuestionnaireDto[], ClientCreateEntityQuestionnaireDto[]>(
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

  async sendQrCodeEmail(sendOnboardingMailDto: OnboardingMailDto): Promise<any> {
    const sendOnboardingMail = plainToInstance(OnboardingMailDto, sendOnboardingMailDto);

    return await this.mailClient.send<any, OnboardingMailDto>(
      MAIL_PATTERN.MAIL_QR_CODE_SEND, sendOnboardingMail
    ).toPromise();
  }

  async sendWelcomeEmail(welcomeMailDto: WelcomeMailDto): Promise<any> {
    const sendWelcomeMail = plainToInstance(WelcomeMailDto, welcomeMailDto);

    return await this.mailClient.send<any, WelcomeMailDto>(
      MAIL_PATTERN.MAIL_WELCOME_SEND, sendWelcomeMail
    ).toPromise();
  }

}
