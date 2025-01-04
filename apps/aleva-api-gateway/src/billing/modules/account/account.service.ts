import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

// constants
import { BILLING_CLIENT } from '../../../common/utils/constants';

// contracts
import {
  ACCOUNT_PATTERN,
  AccountDto as ClientAccountDto,
  CreateAccountDto as ClientCreateAccountDto,
  UpdateAccountDto as ClientUpdateAccountDto,

  ENTITY_ACCOUNT_PATTERN,
  EntityAccountTypeEnum,
  EntityAccountDto as ClientEntityAccountDto,
  CreateEntityAccountDto as ClientCreateEntityAccountDto,
  EntityAddressTypeEnum,
} from '@app/contracts';

// dto
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

// service
import { BaseService } from 'apps/aleva-api-gateway/src/common/service/base.service';
import { AddressService } from 'apps/aleva-api-gateway/src/address/modules/address/address.service';


@Injectable()
export class AccountService extends BaseService<
  EntityAccountTypeEnum | EntityAddressTypeEnum,
  CreateAccountDto,
  UpdateAccountDto,
  ClientAccountDto,
  ClientCreateAccountDto,
  ClientUpdateAccountDto,
  ClientEntityAccountDto,
  ClientCreateEntityAccountDto
> {
  public readonly entityIdKey = 'account_id';

  constructor(
    private readonly addressService: AddressService,
    @Inject(BILLING_CLIENT) private readonly accountClient: ClientProxy
  ) {
    super(
      'account_id',
      accountClient,
      {
        ...ACCOUNT_PATTERN,
        LINK_ENTITY: ENTITY_ACCOUNT_PATTERN.CREATE,
        DELETE_BY_ENTITY: ENTITY_ACCOUNT_PATTERN.DELETE_BY_ENTITY
      },
      ClientCreateEntityAccountDto,
      [
        {
          service: addressService,
          entityType: EntityAddressTypeEnum.ACCOUNT,
          mapKey: 'address',
        }
      ]
    );
  }

  async create(createAccountDto: CreateAccountDto): Promise<ClientAccountDto> {
    const { address, ...createAccountContract } = createAccountDto;

    // create the entity
    const entityResponse = await this.accountClient
      .send<ClientAccountDto, ClientCreateAccountDto>(ACCOUNT_PATTERN.CREATE, createAccountContract)
      .toPromise();

    const fieldResponses = await this.createEntityFields(entityResponse[this.entityIdKey], createAccountDto);

    // merge all responses
    return { ...entityResponse, ...fieldResponses };
  }
}

