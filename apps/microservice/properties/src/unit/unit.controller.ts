import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

// services
import { UnitService } from './unit.service';

// contracts
import { CreateUnitDto, UpdateUnitDto, UNIT_PATTERN } from '@app/contracts';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

@Controller('unit')
export class UnitController {
  constructor(private readonly unitService: UnitService) { }

  @MessagePattern(UNIT_PATTERN.CREATE)
  async create(@Payload() createUnitDto: CreateUnitDto) {
    try {
      return await this.unitService.create(createUnitDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || 'Error creating unit!',
      });
    }
  }

  @MessagePattern(UNIT_PATTERN.FIND_ALL)
  async findAll(@Payload() pageOptionsDto: PageOptionsDto) {
    try {
      return await this.unitService.findAll(pageOptionsDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || 'Error fetching unit!',
      });
    }
  }

  @MessagePattern(UNIT_PATTERN.FIND_ONE)
  async findOne(@Payload() id: string) {
    try {
      return await this.unitService.findOne(id);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || `Error fetching unit with id: ${id}`,
      });
    }
  }

  @MessagePattern(UNIT_PATTERN.UPDATE)
  async update(@Payload() updateUnitDto: UpdateUnitDto) {
    try {
      return await this.unitService.update(updateUnitDto.unit_id, updateUnitDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || `Error updating unit with id: ${updateUnitDto.unit_id}`,
      });
    }
  }

  @MessagePattern(UNIT_PATTERN.DELETE)
  async remove(@Payload() id: string) {
    return await this.unitService.remove(id);
  }
}
