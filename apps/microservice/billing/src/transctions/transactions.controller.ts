import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionsService } from './transactions.service';
import { Transaction } from './entities/transactions.entity';
import { TRANSACTION_PATTERNS } from '../../../../resources/contract-dto/transactions/transactions.patterns';

@Controller()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @MessagePattern(TRANSACTION_PATTERNS.FIND_ALL)
  findAll(@Payload() query: any): Promise<Transaction[]> {
    return this.transactionsService.findAll(query);
  }

  @MessagePattern(TRANSACTION_PATTERNS.FIND_ONE)
  findOne(@Payload() id: string): Promise<Transaction> {
    return this.transactionsService.findOne(id);
  }

  @MessagePattern(TRANSACTION_PATTERNS.CREATE)
  create(@Payload() transactionData: Partial<Transaction>): Promise<Transaction> {
    return this.transactionsService.create(transactionData);
  }

  @MessagePattern(TRANSACTION_PATTERNS.UPDATE)
  update(@Payload() payload: { id: string; transactionData: Partial<Transaction> }): Promise<Transaction> {
    const { id, transactionData } = payload;
    return this.transactionsService.update(id, transactionData);
  }

  @MessagePattern(TRANSACTION_PATTERNS.REMOVE)
  remove(@Payload() id: string): Promise<void> {
    return this.transactionsService.remove(id);
  }
}
