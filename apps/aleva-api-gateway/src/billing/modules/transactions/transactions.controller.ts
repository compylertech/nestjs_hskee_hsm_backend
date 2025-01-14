import { Controller, Get, Post, Body, Param, Query, Put, Delete } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionsDto } from '../../../billing/modules/transactions/dto/create-transaction.dto';
import { UpdateTransactionsDto } from '../../../billing/modules/transactions/dto/update-transaction.dto';


@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  findAll(@Query() query: any) {
    return this.transactionsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(id);
  }

  @Post()
  create(@Body() createTransactionDto: CreateTransactionsDto) {
    return this.transactionsService.create(createTransactionDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionsDto) {
    return this.transactionsService.update(id, updateTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionsService.remove(id);
  }
}
