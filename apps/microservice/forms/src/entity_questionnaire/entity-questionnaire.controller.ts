import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

// services
import { EntityQuestionnaireService } from './entity-questionnaire.service';

// contracts
import { CreateEntityQuestionnaireDto, UpdateEntityQuestionnaireDto, ENTITY_QUESTIONNAIRE_PATTERN } from '@app/contracts';

// dto
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

@Controller('entity_questionnaire')
export class EntityQuestionnaireController {
  constructor(private readonly entityquestionnaireService: EntityQuestionnaireService) { }

  @MessagePattern(ENTITY_QUESTIONNAIRE_PATTERN.CREATE)
  async create(@Payload() createEntityQuestionnaireDto: CreateEntityQuestionnaireDto) {
    try {
      return await this.entityquestionnaireService.create(createEntityQuestionnaireDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || 'Error creating entityquestionnaire!',
      });
    }
  }

  @MessagePattern(ENTITY_QUESTIONNAIRE_PATTERN.FIND_ALL)
  async findAll(@Payload() pageOptionsDto: PageOptionsDto) {
    try {
      return await this.entityquestionnaireService.findAll(pageOptionsDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || 'Error fetching entityquestionnaire!',
      });
    }
  }

  @MessagePattern(ENTITY_QUESTIONNAIRE_PATTERN.FIND_ONE)
  async findOne(@Payload() id: string) {
    try {
      return await this.entityquestionnaireService.findOne(id);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || `Error fetching entityquestionnaire with id: ${id}`,
      });
    }
  }

  @MessagePattern(ENTITY_QUESTIONNAIRE_PATTERN.UPDATE)
  async update(@Payload() updateEntityQuestionnaireDto: UpdateEntityQuestionnaireDto) {
    try {
      return await this.entityquestionnaireService.update(updateEntityQuestionnaireDto.entity_questionnaire_id, updateEntityQuestionnaireDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || `Error updating entityquestionnaire with id: ${updateEntityQuestionnaireDto.entity_questionnaire_id}`,
      });
    }
  }

  @MessagePattern(ENTITY_QUESTIONNAIRE_PATTERN.DELETE)
  async remove(@Payload() id: string) {
    return await this.entityquestionnaireService.remove(id);
  }
}
