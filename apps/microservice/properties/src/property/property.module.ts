import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// entity
import { Property } from './entities/property.entity';
import { PropertyType } from './entities/property-type.entity';
import { PropertyUnitAssoc } from './entities/property-unit-assoc.entity';

// services
import { PropertyService } from './property.service';
import { PropertyUnitAssocService } from './prop-assoc.service';

// controllers
import { PropertyController } from './property.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PropertyUnitAssoc, Property, PropertyType])],
  controllers: [PropertyController],
  providers: [PropertyService, PropertyUnitAssocService],
  exports: [PropertyUnitAssocService]
})
export class PropertyModule {

  constructor(private readonly propertyUnitAssocService: PropertyUnitAssocService) { }

  onModuleInit() {
    // set the shared service in the entity
    Property.setPropertyUnitAssocService(this.propertyUnitAssocService);
  }
}
