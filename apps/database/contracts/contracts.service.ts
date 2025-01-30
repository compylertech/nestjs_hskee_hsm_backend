import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contract } from './entities/entity';

@Injectable()
export class ContractService {
  constructor(
    @InjectRepository(Contract)
    private readonly contractRepository: Repository<Contract>,
  ) {}

  async findAll(query) {
    return this.contractRepository.find({ where: query, relations: ['utilities', 'invoices', 'under_contract', 'media'] });
  }

  async findOne(id: string) {
    return this.contractRepository.findOne({ where: { contract_id: id }, relations: ['utilities', 'invoices', 'under_contract', 'media'] });
  }

  async create(data: Partial<Contract>) {
    return this.contractRepository.save(data);
  }

  async update(id: string, data: Partial<Contract>) {
    await this.contractRepository.update(id, data);
    return this.findOne(id);
  }

  async delete(id: string) {
    return this.contractRepository.delete(id);
  }
}
