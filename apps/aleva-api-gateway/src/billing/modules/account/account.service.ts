import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

// constants
import { BILLING_CLIENT } from '../../../common/utils/constants';

// contracts
import {
  ACCOUNT_PATTERN,
  AccountDto as ClientAccountDto,
  CreateAccountDto as ClientCreateAccountDto,
  UpdateAccountDto as ClientUpdateAccountDto
} from '@app/contracts';

// dto
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';


@Injectable()
export class AccountService {
  constructor(@Inject(BILLING_CLIENT) private readonly accountClient: ClientProxy) { }

  async create(createAccountDto: CreateAccountDto): Promise<ClientAccountDto> {
    const createAccountContract: CreateAccountDto = { ...createAccountDto };

    return this.accountClient.send<ClientAccountDto, ClientCreateAccountDto>(
      ACCOUNT_PATTERN.CREATE, createAccountContract
    ).toPromise();
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<ClientAccountDto[]> {
    return this.accountClient.send<ClientAccountDto[]>(
      ACCOUNT_PATTERN.FIND_ALL,
      pageOptionsDto
    ).toPromise();
  }

  async findOne(accountId: string): Promise<ClientAccountDto> {
    return this.accountClient
      .send<ClientAccountDto>(ACCOUNT_PATTERN.FIND_ONE, accountId)
      .toPromise();
  }

  async update(accountId: string, updateAccountDto: UpdateAccountDto): Promise<ClientAccountDto> {
    const updateAccountContract: UpdateAccountDto = { ...updateAccountDto };

    return this.accountClient.send<ClientAccountDto, ClientUpdateAccountDto>(
      ACCOUNT_PATTERN.UPDATE,
      { account_id: accountId, ...updateAccountContract }
    ).toPromise();
  }

  async remove(accountId: string): Promise<void> {
    return this.accountClient.send<ClientAccountDto>(
      ACCOUNT_PATTERN.DELETE,
      accountId
    ).toPromise();
  }
}

