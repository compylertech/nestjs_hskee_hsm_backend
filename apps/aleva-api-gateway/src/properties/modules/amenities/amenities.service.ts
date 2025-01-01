import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

// constants
import { PROPERTIES_CLIENT } from '../../../common/utils/constants';

// contracts
import {
  AMENITIES_PATTERN,
  AmenitiesDto as ClientAmenitiesDto,
  CreateAmenitiesDto as ClientCreateAmenitiesDto,
  UpdateAmenitiesDto as ClientUpdateAmenitiesDto
} from '@app/contracts';

// dto
import { CreateAmenitiesDto } from './dto/create-amenities.dto';
import { UpdateAmenitiesDto } from './dto/update-amenities.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';


@Injectable()
export class AmenitiesService {
  constructor(@Inject(PROPERTIES_CLIENT) private readonly amenitiesClient: ClientProxy) { }

  async create(createAmenitiesDto: CreateAmenitiesDto): Promise<ClientAmenitiesDto> {
    const createAmenitiesContract: CreateAmenitiesDto = { ...createAmenitiesDto };

    return this.amenitiesClient.send<ClientAmenitiesDto, ClientCreateAmenitiesDto>(
      AMENITIES_PATTERN.CREATE, createAmenitiesContract
    ).toPromise();
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<ClientAmenitiesDto[]> {
    return this.amenitiesClient.send<ClientAmenitiesDto[]>(
      AMENITIES_PATTERN.FIND_ALL,
      pageOptionsDto
    ).toPromise();
  }

  async findOne(amenitiesId: string): Promise<ClientAmenitiesDto> {
    return this.amenitiesClient
      .send<ClientAmenitiesDto>(AMENITIES_PATTERN.FIND_ONE, amenitiesId)
      .toPromise();
  }

  async update(amenitiesId: string, updateAmenitiesDto: UpdateAmenitiesDto): Promise<ClientAmenitiesDto> {
    const updateAmenitiesContract: UpdateAmenitiesDto = { ...updateAmenitiesDto };

    return this.amenitiesClient.send<ClientAmenitiesDto, ClientUpdateAmenitiesDto>(
      AMENITIES_PATTERN.UPDATE,
      { amenity_id: amenitiesId, ...updateAmenitiesContract }
    ).toPromise();
  }

  async remove(amenitiesId: string): Promise<void> {
    return this.amenitiesClient.send<ClientAmenitiesDto>(
      AMENITIES_PATTERN.DELETE,
      amenitiesId
    ).toPromise();
  }
}

