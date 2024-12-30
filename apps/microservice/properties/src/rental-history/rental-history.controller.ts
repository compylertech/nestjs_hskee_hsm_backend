import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

// services
import { RentalHistoryService } from './rental-history.service';

// contracts
import { CreateRentalHistoryDto, UpdateRentalHistoryDto, RENTAL_HISTORY_PATTERN } from '@app/contracts';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

@Controller('rentalHistory')
export class RentalHistoryController {
  constructor(private readonly rentalHistoryService: RentalHistoryService) { }

  @MessagePattern(RENTAL_HISTORY_PATTERN.CREATE)
  async create(@Payload() createRentalHistoryDto: CreateRentalHistoryDto) {
    try {
      return await this.rentalHistoryService.create(createRentalHistoryDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || 'Error creating rentalHistory!',
      });
    }
  }

  @MessagePattern(RENTAL_HISTORY_PATTERN.FIND_ALL)
  async findAll(@Payload() pageOptionsDto: PageOptionsDto) {
    try {
      return await this.rentalHistoryService.findAll(pageOptionsDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || 'Error fetching rentalHistory!',
      });
    }
  }

  @MessagePattern(RENTAL_HISTORY_PATTERN.FIND_ONE)
  async findOne(@Payload() id: string) {
    try {
      return await this.rentalHistoryService.findOne(id);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || `Error fetching rentalHistory with id: ${id}`,
      });
    }
  }

  @MessagePattern(RENTAL_HISTORY_PATTERN.UPDATE)
  update(@Payload() updateRentalHistoryDto: UpdateRentalHistoryDto) {
    try {
      return this.rentalHistoryService.update(updateRentalHistoryDto.rental_history_id, updateRentalHistoryDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || `Error updating rentalHistory with id: ${updateRentalHistoryDto.rental_history_id}`,
      });
    }
  }

  @MessagePattern(RENTAL_HISTORY_PATTERN.DELETE)
  remove(@Payload() id: string) {
    return this.rentalHistoryService.remove(id);
  }
}
