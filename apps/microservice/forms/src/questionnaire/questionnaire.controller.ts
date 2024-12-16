import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

// services
import { QuestionnaireService } from './questionnaire.service';

// contracts
import { CreateQuestionnaireDto, UpdateQuestionnaireDto, QUESTIONNAIRE_PATTERN } from '@app/contracts';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

@Controller('questionnaire')
export class QuestionnaireController {
  constructor(private readonly questionnaireService: QuestionnaireService) { }

  @MessagePattern(QUESTIONNAIRE_PATTERN.CREATE)
  async create(@Payload() createQuestionnaireDto: CreateQuestionnaireDto) {
    try {
      return await this.questionnaireService.create(createQuestionnaireDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || 'Error creating questionnaire!',
      });
    }
  }

  @MessagePattern(QUESTIONNAIRE_PATTERN.FIND_ALL)
  async findAll(@Payload() pageOptionsDto: PageOptionsDto) {
    try {
      return await this.questionnaireService.findAll(pageOptionsDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || 'Error fetching questionnaire!',
      });
    }
  }

  @MessagePattern(QUESTIONNAIRE_PATTERN.FIND_ONE)
  async findOne(@Payload() id: string) {
    try {
      return await this.questionnaireService.findOne(id);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || `Error fetching questionnaire with id: ${id}`,
      });
    }
  }

  @MessagePattern(QUESTIONNAIRE_PATTERN.UPDATE)
  update(@Payload() updateQuestionnaireDto: UpdateQuestionnaireDto) {
    try {
      return this.questionnaireService.update(updateQuestionnaireDto.questionnaire_id, updateQuestionnaireDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || `Error updating questionnaire with id: ${updateQuestionnaireDto.questionnaire_id}`,
      });
    }
  }

  @MessagePattern(QUESTIONNAIRE_PATTERN.DELETE)
  remove(@Payload() id: string) {
    return this.questionnaireService.remove(id);
  }
}
