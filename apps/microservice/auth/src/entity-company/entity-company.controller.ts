import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

// services
import { EntityCompanyService } from './entity-company.service';

// contracts
import { CreateEntityCompanyDto, UpdateEntityCompanyDto, ENTITY_COMPANY_PATTERN } from '@app/contracts';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

@Controller('entityCompany')
export class EntityCompanyController {
  constructor(private readonly entityCompanyService: EntityCompanyService) { }

  @MessagePattern(ENTITY_COMPANY_PATTERN.CREATE)
  async create(@Payload() createEntityCompanyDto: CreateEntityCompanyDto) {
    try {
      return await this.entityCompanyService.create(createEntityCompanyDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || 'Error creating entityCompany!',
      });
    }
  }

  @MessagePattern(ENTITY_COMPANY_PATTERN.FIND_ALL)
  async findAll(@Payload() pageOptionsDto: PageOptionsDto) {
    try {
      return await this.entityCompanyService.findAll(pageOptionsDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || 'Error fetching entityCompany!',
      });
    }
  }

  @MessagePattern(ENTITY_COMPANY_PATTERN.FIND_ONE)
  async findOne(@Payload() id: string) {
    try {
      return await this.entityCompanyService.findOne(id);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || `Error fetching entityCompany with id: ${id}`,
      });
    }
  }

  @MessagePattern(ENTITY_COMPANY_PATTERN.UPDATE)
  update(@Payload() updateEntityCompanyDto: UpdateEntityCompanyDto) {
    try {
      return this.entityCompanyService.update(updateEntityCompanyDto.entity_company_id, updateEntityCompanyDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || `Error updating entityCompany with id: ${updateEntityCompanyDto.entity_company_id}`,
      });
    }
  }

  @MessagePattern(ENTITY_COMPANY_PATTERN.DELETE)
  remove(@Payload() id: string) {
    return this.entityCompanyService.remove(id);
  }
}
