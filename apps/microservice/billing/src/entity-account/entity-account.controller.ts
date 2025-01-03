import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

// services
import { EntityAccountService } from './entity-account.service';

// contracts
import { CreateEntityAccountDto, UpdateEntityAccountDto, ENTITY_ACCOUNT_PATTERN, EntityAccountTypeEnum } from '@app/contracts';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

@Controller('entityAccount')
export class EntityAccountController {
  constructor(private readonly entityAccountService: EntityAccountService) { }

  @MessagePattern(ENTITY_ACCOUNT_PATTERN.CREATE)
  async create(@Payload() createEntityAccountDto: CreateEntityAccountDto) {
    try {
      return await this.entityAccountService.create(createEntityAccountDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || 'Error creating entityAccount!',
      });
    }
  }

  @MessagePattern(ENTITY_ACCOUNT_PATTERN.FIND_ALL)
  async findAll(@Payload() pageOptionsDto: PageOptionsDto) {
    try {
      return await this.entityAccountService.findAll(pageOptionsDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || 'Error fetching entityAccount!',
      });
    }
  }

  @MessagePattern(ENTITY_ACCOUNT_PATTERN.FIND_ONE)
  async findOne(@Payload() id: string) {
    try {
      return await this.entityAccountService.findOne(id);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || `Error fetching entityAccount with id: ${id}`,
      });
    }
  }

  @MessagePattern(ENTITY_ACCOUNT_PATTERN.FIND_BY_ENTITY)
  async findByEntity(@Payload() payload: { entity_id: string; entity_type: string }) {
    const { entity_id, entity_type } = payload;

    try {
      if (!Object.values(EntityAccountTypeEnum).includes(entity_type as EntityAccountTypeEnum)) {
        throw new Error(`Invalid entity_type: ${entity_type}`);
      }

      return await this.entityAccountService.findByEntity(entity_id, entity_type as EntityAccountTypeEnum);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || `Error fetching entityMedia with id: ${entity_id}`,
      });
    }
  }

  @MessagePattern(ENTITY_ACCOUNT_PATTERN.UPDATE)
  async update(@Payload() updateEntityAccountDto: UpdateEntityAccountDto) {
    try {
      return await this.entityAccountService.update(updateEntityAccountDto.entity_account_id, updateEntityAccountDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || `Error updating entityAccount with id: ${updateEntityAccountDto.entity_account_id}`,
      });
    }
  }

  @MessagePattern(ENTITY_ACCOUNT_PATTERN.DELETE)
  async remove(@Payload() id: string) {
    await this.entityAccountService.remove(id);
  }

  @MessagePattern(ENTITY_ACCOUNT_PATTERN.DELETE_BY_ENTITY)
  async deleteByEntity(@Payload() payload: { entity_id: string; entity_type: string }): Promise<void> {
    const { entity_id, entity_type } = payload;

    if (!Object.values(EntityAccountTypeEnum).includes(entity_type as EntityAccountTypeEnum)) {
      throw new Error(`Invalid entity_type: ${entity_type}`);
    }

    await this.entityAccountService.deleteByEntity(entity_id, entity_type as EntityAccountTypeEnum);
  }
}
