import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// entity
import { Unit } from './entities/unit.entity';
import { Property } from '../property/entities/property.entity';
import { PropertyType } from '../property/entities/property-type.entity';
import { PropertyUnitAssoc } from '../property/entities/property-unit-assoc.entity';

// services
import { UnitService } from './unit.service';
import { PropertyUnitAssocService } from '../property/prop-assoc.service';

// controllers
import { UnitController } from './unit.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PropertyUnitAssoc, Property, Unit, PropertyType])],
  controllers: [UnitController],
  providers: [UnitService, PropertyUnitAssocService],
  exports: [PropertyUnitAssocService]
})
export class UnitModule {
  constructor(private readonly propertyUnitAssocService: PropertyUnitAssocService) { }

  onModuleInit() {
    Unit.setPropertyUnitAssocService(this.propertyUnitAssocService);
  }
}
