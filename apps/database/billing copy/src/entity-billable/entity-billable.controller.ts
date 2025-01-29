import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

// services
import { EntityBillableService } from './entity-billable.service';

// contracts
import { CreateEntityBillableDto, UpdateEntityBillableDto, ENTITY_BILLABLE_PATTERN } from '@app/contracts';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

@Controller('entityBillable')
export class EntityBillableController {
  constructor(private readonly entityBillableService: EntityBillableService) { }

  @MessagePattern(ENTITY_BILLABLE_PATTERN.CREATE)
  async create(@Payload() createEntityBillableDto: CreateEntityBillableDto) {
    try {
      return await this.entityBillableService.create(createEntityBillableDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || 'Error creating entityBillable!',
      });
    }
  }

  @MessagePattern(ENTITY_BILLABLE_PATTERN.FIND_ALL)
  async findAll(@Payload() pageOptionsDto: PageOptionsDto) {
    try {
      return await this.entityBillableService.findAll(pageOptionsDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || 'Error fetching entityBillable!',
      });
    }
  }

  @MessagePattern(ENTITY_BILLABLE_PATTERN.FIND_ONE)
  async findOne(@Payload() id: string) {
    try {
      return await this.entityBillableService.findOne(id);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || `Error fetching entityBillable with id: ${id}`,
      });
    }
  }

  @MessagePattern(ENTITY_BILLABLE_PATTERN.UPDATE)
  update(@Payload() updateEntityBillableDto: UpdateEntityBillableDto) {
    try {
      return this.entityBillableService.update(updateEntityBillableDto.entity_billable_id, updateEntityBillableDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || `Error updating entityBillable with id: ${updateEntityBillableDto.entity_billable_id}`,
      });
    }
  }

  @MessagePattern(ENTITY_BILLABLE_PATTERN.DELETE)
  remove(@Payload() id: string) {
    return this.entityBillableService.remove(id);
  }
}
