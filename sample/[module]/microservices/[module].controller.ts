import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

// services
import { [Module]Service } from './[module].service';

// contracts
import { Create[Module]Dto, Update[Module]Dto, [MODULE]_PATTERN } from '@app/contracts';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

@Controller('[module]')
export class [Module]Controller {
  constructor(private readonly [module]Service: [Module]Service) { }

  @MessagePattern([MODULE]_PATTERN.CREATE)
  async create(@Payload() create[Module]Dto: Create[Module]Dto) {
    try {
      return await this.[module]Service.create(create[Module]Dto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || 'Error creating [module]!',
      });
    }
  }

  @MessagePattern([MODULE]_PATTERN.FIND_ALL)
  async findAll(@Payload() pageOptionsDto: PageOptionsDto) {
    try {
      return await this.[module]Service.findAll(pageOptionsDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || 'Error fetching [module]!',
      });
    }
  }

  @MessagePattern([MODULE]_PATTERN.FIND_ONE)
  async findOne(@Payload() id: string) {
    try {
      return await this.[module]Service.findOne(id);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || `Error fetching [module] with id: ${id}`,
      });
    }
  }

  @MessagePattern([MODULE]_PATTERN.UPDATE)
  update(@Payload() update[Module]Dto: Update[Module]Dto) {
    try {
      return this.[module]Service.update(update[Module]Dto.[module]_id, update[Module]Dto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || `Error updating [module] with id: ${update[Module]Dto.[module]_id}`,
      });
    }
  }

  @MessagePattern([MODULE]_PATTERN.REMOVE)
  remove(@Payload() id: string) {
    return this.[module]Service.remove(id);
  }
}
