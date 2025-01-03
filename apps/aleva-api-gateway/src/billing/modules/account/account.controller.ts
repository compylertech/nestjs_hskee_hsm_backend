import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Controller, Post, Get, Patch, Delete, Body, Param, Query, HttpCode } from '@nestjs/common';

// services
import { AccountService } from './account.service';

// dto
import { AccountDto } from './dto/account.dto';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

@ApiBearerAuth()
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) { }

  @Post()
  @ApiOperation({ summary: 'Create Account' })
  @ApiResponse({ status: 200, description: 'Successfully fetched accounts.', type: AccountDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async createAccount(@Body() createAccountDto: CreateAccountDto) {
    return this.accountService.create(createAccountDto);
  }

  @Get()
  @ApiOperation({ summary: 'Fetch All Account' })
  @ApiResponse({ status: 200, description: 'Successfully fetched account.', type: AccountDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    let query = await this.accountService.findAll(pageOptionsDto);
    return query;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch Single Account' })
  @ApiResponse({ status: 200, description: 'Successfully fetched account.', type: AccountDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async findOne(@Param('id') id: string) {
    let query = await this.accountService.findOne(id);
    return query;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Account' })
  @ApiResponse({ status: 200, description: 'Successfully fetched account.', type: AccountDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    let query = await this.accountService.update(id, updateAccountDto);
    return query;
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete Account' })
  async remove(@Param('id') accountId: string) {
    await this.accountService.remove(accountId);
  }

}