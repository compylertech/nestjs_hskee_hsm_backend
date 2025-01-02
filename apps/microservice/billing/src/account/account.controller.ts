import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

// services
import { AccountService } from './account.service';

// contracts
import { CreateAccountDto, UpdateAccountDto, ACCOUNT_PATTERN } from '@app/contracts';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) { }

  @MessagePattern(ACCOUNT_PATTERN.CREATE)
  async create(@Payload() createAccountDto: CreateAccountDto) {
    try {
      return await this.accountService.create(createAccountDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || 'Error creating account!',
      });
    }
  }

  @MessagePattern(ACCOUNT_PATTERN.FIND_ALL)
  async findAll(@Payload() pageOptionsDto: PageOptionsDto) {
    try {
      return await this.accountService.findAll(pageOptionsDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || 'Error fetching account!',
      });
    }
  }

  @MessagePattern(ACCOUNT_PATTERN.FIND_ONE)
  async findOne(@Payload() id: string) {
    try {
      return await this.accountService.findOne(id);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || `Error fetching account with id: ${id}`,
      });
    }
  }

  @MessagePattern(ACCOUNT_PATTERN.UPDATE)
  update(@Payload() updateAccountDto: UpdateAccountDto) {
    try {
      return this.accountService.update(updateAccountDto.account_id, updateAccountDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || `Error updating account with id: ${updateAccountDto.account_id}`,
      });
    }
  }

  @MessagePattern(ACCOUNT_PATTERN.DELETE)
  remove(@Payload() id: string) {
    return this.accountService.remove(id);
  }
}