import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

// constants
import { PROPERTIES_CLIENT } from '../../../common/utils/constants';

// contracts
import {
  PROPERTY_PATTERN,
  PropertyDto as ClientPropertyDto,
  CreatePropertyDto as ClientCreatePropertyDto,
  UpdatePropertyDto as ClientUpdatePropertyDto
} from '@app/contracts';

// dto
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';


@Injectable()
export class PropertyService {
  constructor(@Inject(PROPERTIES_CLIENT) private readonly propertyClient: ClientProxy) { }

  async create(createPropertyDto: CreatePropertyDto): Promise<ClientPropertyDto> {
    const createPropertyContract: CreatePropertyDto = { ...createPropertyDto };

    return this.propertyClient.send<ClientPropertyDto, ClientCreatePropertyDto>(
      PROPERTY_PATTERN.CREATE, createPropertyContract
    ).toPromise();
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<ClientPropertyDto[]> {
    return this.propertyClient.send<ClientPropertyDto[]>(
      PROPERTY_PATTERN.FIND_ALL,
      pageOptionsDto
    ).toPromise();
  }

  async findOne(propertyId: string): Promise<ClientPropertyDto> {
    return this.propertyClient
      .send<ClientPropertyDto>(PROPERTY_PATTERN.FIND_ONE, propertyId)
      .toPromise();
  }

  async update(propertyId: string, updatePropertyDto: UpdatePropertyDto): Promise<ClientPropertyDto> {
    const updatePropertyContract: UpdatePropertyDto = { ...updatePropertyDto };

    return this.propertyClient.send<ClientPropertyDto, ClientUpdatePropertyDto>(
      PROPERTY_PATTERN.UPDATE,
      { property_id: propertyId, ...updatePropertyContract }
    ).toPromise();
  }

  async remove(propertyId: string): Promise<void> {
    return this.propertyClient.send<ClientPropertyDto>(
      PROPERTY_PATTERN.DELETE,
      propertyId
    ).toPromise();
  }
}

