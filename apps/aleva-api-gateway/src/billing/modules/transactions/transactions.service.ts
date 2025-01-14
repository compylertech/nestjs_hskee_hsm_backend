import { Injectable } from '@nestjs/common';
import { CreateTransactionsDto } from '../../../billing/modules/transactions/dto/create-transaction.dto';
import { UpdateTransactionsDto } from '../../../billing/modules/transactions/dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  private transactions = [];

  findAll(query: any) {
    return { message: 'All transactions fetched successfully', query };
  }

  findOne(id: string) {

    return { message: `Transaction with ID ${id} fetched successfully` };
  }

  create(createTransactionDto: CreateTransactionsDto) {
    return { message: 'Transaction created successfully', data: createTransactionDto };
  }

  update(id: string, updateTransactionDto: UpdateTransactionsDto) {
    return { message: `Transaction with ID ${id} updated successfully`, data: updateTransactionDto };
  }

  remove(id: string) {
    return { message: `Transaction with ID ${id} removed successfully` };
  }
}
