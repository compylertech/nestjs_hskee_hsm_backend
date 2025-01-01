import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

// entity
import { Account } from './entities/account.entity';

// contracts
import { AccountDto, CreateAccountDto, UpdateAccountDto } from '@app/contracts';

// page-meta
import { PageDto } from 'apps/common/dto/page.dto';
import { PageMetaDto } from 'apps/common/dto/page-meta.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

@Injectable()
export class AccountService {
  constructor(@InjectRepository(Account) private accountRepository: Repository<Account>) { }


  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    const newAccount = this.accountRepository.create(createAccountDto);

    return this.accountRepository.save(newAccount);
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<AccountDto>> {
    const options = plainToInstance(PageOptionsDto, pageOptionsDto);
    const queryBuilder = this.accountRepository.createQueryBuilder('account');
    
    queryBuilder
      .orderBy('account.created_at', pageOptionsDto.order)
      .skip(options.skip)
      .take(options.limit);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: string): Promise<AccountDto> {
    const account = await this.findEntityById(id);

    return plainToInstance(AccountDto, account, { excludeExtraneousValues: false });
  }

  async update(id: string, updateAccountDto: UpdateAccountDto): Promise<AccountDto> {
    const account = await this.findEntityById(id);

    // merge the updates into the account entity
    const updateAccount = this.accountRepository.merge(account, updateAccountDto);
    await this.accountRepository.save(updateAccount);

    return plainToInstance(AccountDto, updateAccount, { excludeExtraneousValues: false });
  }

  async remove(id: string): Promise<void> {
    const account = await this.findEntityById(id);
    await this.accountRepository.remove(account);
  }

  private async findEntityById(id: string): Promise<Account> {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid UUID: ${id}`);
    }

    const account = await this.accountRepository.findOne({ where: { account_id: id } });

    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }

    return account;
  }
}
