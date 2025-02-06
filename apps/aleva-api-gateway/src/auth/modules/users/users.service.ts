import { plainToInstance } from 'class-transformer';
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
  ConfirmMailDto,
  EntityQuestionnaireTypeEnum,
} from '@app/contracts';

// dto
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';
import { CreateEntityQuestionnaireDto } from '../../../forms//modules/questionnaire/dto/create-entity-questionnaire.dto';

// pipes
import { transformGatewayUserDto } from './pipes/user-transform.pipe';

// services
import { MediaService } from 'apps/aleva-api-gateway/src/resources/modules/media/media.service';
import { AddressService } from 'apps/aleva-api-gateway/src/address/modules/address/address.service';

import { CrudService } from 'apps/aleva-api-gateway/src/common/service/crud-impl.service';
import { BaseService } from 'apps/aleva-api-gateway/src/common/service/base-impl-crud.service';
import { EntityQuestionnaireService } from 'apps/aleva-api-gateway/src/forms/modules/entity-questionnaire/entity-questionnaire.service';

@Injectable()
export class UsersService extends BaseService<
  EntityAddressTypeEnum | EntityMediaTypeEnum | EntityQuestionnaireTypeEnum,
  CreateUserDto,
  UpdateUserDto,
  ClientUserDto,
  ClientCreateUserDto,
  ClientUpdateUserDto,
  null,
  null
> {

  mapKeys: string[];

  constructor(
    private readonly mediaService: MediaService,
    private readonly addressService: AddressService,
    private readonly entityQuestionnaireService: EntityQuestionnaireService,
    @Inject(RBAC_CLIENT) private rbacClient: ClientProxy,
    @Inject(FORMS_CLIENT) private formsClient: ClientProxy,
    @Inject(MAIL_CLIENT) private mailClient: ClientProxy
  ) {
    const entityIdKey: string = 'user_id';
    const mappings: Array<{
      service: CrudService<
        EntityAddressTypeEnum | EntityMediaTypeEnum | EntityQuestionnaireTypeEnum,
        CreateUserDto, UpdateUserDto,
        ClientUserDto, ClientCreateUserDto, ClientUpdateUserDto,
        null, null> | any;
      entityType: EntityAddressTypeEnum | EntityMediaTypeEnum | EntityQuestionnaireTypeEnum;
      mapKey: keyof ClientUserDto;
    }> = [
        {
          service: mediaService.crudService,
          entityType: EntityMediaTypeEnum.USER,
          mapKey: 'media',
        },
        {
          service: addressService.crudService,
          entityType: EntityAddressTypeEnum.USER,
          mapKey: 'address',
        },
        {
          service: entityQuestionnaireService.crudService,
          entityType: EntityQuestionnaireTypeEnum.USER,
          mapKey: 'answers',
        }
      ]

    const crudService = new CrudService<
      EntityAddressTypeEnum | EntityMediaTypeEnum | EntityQuestionnaireTypeEnum,
      CreateUserDto,
      UpdateUserDto,
      ClientUserDto,
      ClientCreateUserDto,
      ClientUpdateUserDto,
      null,
      null
    >(
      entityIdKey,
      rbacClient,
      {
        ...USERS_PATTERNS,
        LINK_ENTITY: '',
        DELETE_BY_ENTITY: ''
      },
      null,
      mappings
    );
    super(entityIdKey, rbacClient, crudService);

    this.mapKeys = mappings.map(({ mapKey }) => mapKey as string);
  }

  async create(createDto: CreateUserDto, tag: string = null): Promise<ClientUserDto> {
    const createContractDto = Object.entries(createDto).reduce((acc, [key, value]) => {
      if (!this.mapKeys.includes(key)) {
        acc[key] = value;
      }
      return acc;
    }, {} as CreateUserDto);

    const transformedDto = transformGatewayUserDto(createContractDto);
    const result = await super.create(transformedDto as CreateUserDto);
    return result;
  }

  async findByEmail(email: string): Promise<ClientUserDto | undefined> {
    const userResponse = await this.rbacClient
      .send<ClientUserDto>(USERS_PATTERNS.FIND_ONE_EMAIL, email)
      .toPromise();

    return userResponse || null;
  }

  async sendQrCodeEmail(sendOnboardingMailDto: OnboardingMailDto): Promise<any> {
    const sendOnboardingMail = plainToInstance(OnboardingMailDto, sendOnboardingMailDto);

    return await this.mailClient.send<any, OnboardingMailDto>(
      MAIL_PATTERN.MAIL_QR_CODE_SEND, sendOnboardingMail
    ).toPromise();
  }

  // async sendWelcomeEmail(sendWelcomeMailDto: WelcomeMailDto): Promise<any> {
  //   const sendWelcomeMail = plainToInstance(WelcomeMailDto, sendWelcomeMailDto);

  //   return await this.mailClient.send<any, WelcomeMailDto>(
  //     MAIL_PATTERN.MAIL_WELCOME_SEND, sendWelcomeMail
  //   ).toPromise();
  // }
}