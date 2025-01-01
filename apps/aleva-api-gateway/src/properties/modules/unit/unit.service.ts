import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

// constants
import { PROPERTIES_CLIENT } from '../../../common/utils/constants';

// contracts
import {
  UNIT_PATTERN,
  UnitDto as ClientUnitDto,
  CreateUnitDto as ClientCreateUnitDto,
  UpdateUnitDto as ClientUpdateUnitDto
} from '@app/contracts';

// dto
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';


@Injectable()
export class UnitService {
  constructor(@Inject(PROPERTIES_CLIENT) private readonly unitClient: ClientProxy) { }

  async create(createUnitDto: CreateUnitDto): Promise<ClientUnitDto> {
    const createUnitContract: CreateUnitDto = { ...createUnitDto };

    return this.unitClient.send<ClientUnitDto, ClientCreateUnitDto>(
      UNIT_PATTERN.CREATE, createUnitContract
    ).toPromise();
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<ClientUnitDto[]> {
    return this.unitClient.send<ClientUnitDto[]>(
      UNIT_PATTERN.FIND_ALL,
      pageOptionsDto
    ).toPromise();
  }

  async findOne(unitId: string): Promise<ClientUnitDto> {
    return this.unitClient
      .send<ClientUnitDto>(UNIT_PATTERN.FIND_ONE, unitId)
      .toPromise();
  }

  async update(unitId: string, updateUnitDto: UpdateUnitDto): Promise<ClientUnitDto> {
    const updateUnitContract: UpdateUnitDto = { ...updateUnitDto };

    return this.unitClient.send<ClientUnitDto, ClientUpdateUnitDto>(
      UNIT_PATTERN.UPDATE,
      { property_unit_assoc_id: unitId, ...updateUnitContract }
    ).toPromise();
  }

  async remove(unitId: string): Promise<void> {
    await this.unitClient.send<ClientUnitDto>(
      UNIT_PATTERN.DELETE,
      unitId
    ).toPromise();
  }
}

