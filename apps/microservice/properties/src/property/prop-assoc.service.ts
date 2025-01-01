import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PropertyUnitAssoc } from './entities/property-unit-assoc.entity';

@Injectable()
export class PropertyUnitAssocService {
  constructor(
    @InjectRepository(PropertyUnitAssoc)
    public readonly propertyUnitAssocRepository: Repository<PropertyUnitAssoc>,
  ) {}
}
