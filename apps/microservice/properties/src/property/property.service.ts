import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { BadRequestException, Injectable } from '@nestjs/common';

// entity
import { Property } from './entities/property.entity';
import { PropertyType } from './entities/property-type.entity';

// contracts
import { PropertyDto, CreatePropertyDto, UpdatePropertyDto } from '@app/contracts';

// page-meta
import { PageDto } from 'apps/common/dto/page.dto';
import { PageMetaDto } from 'apps/common/dto/page-meta.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';
import { PropertyUnitAssoc } from './entities/property-unit-assoc.entity';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property) private propertyRepository: Repository<Property>,
    @InjectRepository(PropertyType) private propertyTypeRepository: Repository<PropertyType>,
    @InjectRepository(PropertyUnitAssoc) public propertyUnitAssocRepository: Repository<PropertyUnitAssoc>
  ) { }


  async create(createPropertyDto: CreatePropertyDto): Promise<PropertyDto> {
    // find the related PropertyType entity
    const propertyType = await this.propertyTypeRepository.findOne({
      where: { name: createPropertyDto.property_type },
    });

    if (!propertyType) {
      throw new Error(`PropertyType with ID ${createPropertyDto.property_type} not found`);
    }
    
    // create property record
    const newProperty = this.propertyRepository.create({
      ...createPropertyDto,
      property_type: propertyType,
    });

    const savedEntity = await this.propertyRepository.save(newProperty);
    const transformedEntities = plainToInstance(PropertyDto, savedEntity, { excludeExtraneousValues: false });

    return transformedEntities;
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<PropertyDto>> {
    const options = plainToInstance(PageOptionsDto, pageOptionsDto);
    const queryBuilder = this.propertyRepository.createQueryBuilder('property');

    queryBuilder
      .leftJoinAndSelect('property.property_type', 'property_type')
      .leftJoinAndSelect('property.units', 'units')
      .orderBy('property.created_at', pageOptionsDto.order)
      .skip(options.skip)
      .take(options.limit);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    // transform Property entities into PropertyDto
    const propertyDtos = entities.map((property) => this.mapToPropertyDto(property));

    return new PageDto(propertyDtos, pageMetaDto);
  }

  async findOne(id: string): Promise<PropertyDto> {
    const queryBuilder = this.propertyRepository.createQueryBuilder('property');

    queryBuilder
    .leftJoinAndSelect('property.property_type', 'property_type')
    .leftJoinAndSelect('property.units', 'unit')
    .where('property.property_unit_assoc_id = :id', { id })
    .orderBy('property.created_at', 'DESC');

    const property = await queryBuilder.getOne();

    if (!property) {
      throw new Error(`Property with ID ${id} not found`);
    }

    return plainToInstance(PropertyDto, property, { excludeExtraneousValues: false });
   
  }

  async update(id: string, updatePropertyDto: UpdatePropertyDto): Promise<PropertyDto> {
    const property = await this.findEntityById(id);

    // transform `property_type` if needed
    if (updatePropertyDto.property_type) {
      const propertyType = await this.propertyTypeRepository.findOne({
        where: { name: updatePropertyDto.property_type },
      });
      property.property_type = propertyType;
    }

    // merge the updates into the property entity
    const updateProperty = this.propertyRepository.merge(property, {
      ...updatePropertyDto,
      property_type: property.property_type,
    });
    await this.propertyRepository.save(updateProperty);

    return this.mapToPropertyDto(updateProperty);
  }

  async remove(id: string): Promise<void> {
    const property = await this.findEntityById(id);
    await this.propertyRepository.remove(property);
  }

  private async findEntityById(id: string): Promise<Property> {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid UUID: ${id}`);
    }

    const property = await this.propertyRepository.findOne({
      where: { property_unit_assoc_id: id },
      relations: ['property_type']
    });

    if (!property) {
      throw new Error(`Property with ID ${id} not found`);
    }

    return property;
  }

  private mapToPropertyDto(property: Property): PropertyDto {
    return {
      ...property,
      property_type: property.property_type.name
    };
  }
  
}
