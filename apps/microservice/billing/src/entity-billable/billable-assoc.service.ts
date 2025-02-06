import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// entity
import { BillableAssoc } from './entities/billable.entity';

@Injectable()
export class BillableAssocService {
  constructor(
    @InjectRepository(BillableAssoc)
    public readonly billableAssocRepository: Repository<BillableAssoc>
  ) {}
}
