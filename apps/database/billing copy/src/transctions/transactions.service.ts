import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transactions.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionsRepository: Repository<Transaction>,
  ) {}

  findAll(query: any): Promise<Transaction[]> {
    return this.transactionsRepository.find();
  }

  findOne(id: string): Promise<Transaction> {
    return this.transactionsRepository.findOne({ where: { transaction_id: id } });
  }

  create(transactionData: Partial<Transaction>): Promise<Transaction> {
    const transaction = this.transactionsRepository.create(transactionData);
    return this.transactionsRepository.save(transaction);
  }

  async update(id: string, transactionData: Partial<Transaction>): Promise<Transaction> {
    await this.transactionsRepository.update(id, transactionData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.transactionsRepository.delete(id);
  }
}
