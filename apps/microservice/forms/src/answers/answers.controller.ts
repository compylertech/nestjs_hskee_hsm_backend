import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

// services
import { AnswerService } from './answers.service';

// contracts
import { CreateAnswerDto, UpdateAnswerDto, ANSWER_PATTERN } from '@app/contracts';

// dto
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

@Controller('answer')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) { }

  @MessagePattern(ANSWER_PATTERN.CREATE)
  async create(@Payload() createAnswerDto: CreateAnswerDto) {
    try {
      return await this.answerService.create(createAnswerDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || 'Error creating answer!',
      });
    }
  }

  @MessagePattern(ANSWER_PATTERN.FIND_ALL)
  async findAll(@Payload() pageOptionsDto: PageOptionsDto) {
    try {
      return await this.answerService.findAll(pageOptionsDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || 'Error fetching answer!',
      });
    }
  }

  @MessagePattern(ANSWER_PATTERN.FIND_ONE)
  async findOne(@Payload() id: string) {
    try {
      return await this.answerService.findOne(id);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || `Error fetching answer with id: ${id}`,
      });
    }
  }

  @MessagePattern(ANSWER_PATTERN.UPDATE)
  update(@Payload() updateAnswerDto: UpdateAnswerDto) {
    try {
      return this.answerService.update(updateAnswerDto.answer_id, updateAnswerDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || `Error updating answer with id: ${updateAnswerDto.answer_id}`,
      });
    }
  }

  @MessagePattern(ANSWER_PATTERN.REMOVE)
  remove(@Payload() id: string) {
    return this.answerService.remove(id);
  }
}
