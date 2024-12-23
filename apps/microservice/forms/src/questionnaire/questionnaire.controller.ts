import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

// services
import { QuestionnaireService } from './questionnaire.service';
import { EntityQuestionnaireService } from '../entity_questionnaire/entity-questionnaire.service';

// contracts
import { CreateQuestionnaireDto, UpdateQuestionnaireDto, QUESTIONNAIRE_PATTERN } from '@app/contracts';

// page-meta
import { PageDto } from 'apps/common/dto/page.dto';
import { PageMetaDto } from 'apps/common/dto/page-meta.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

@Controller('questionnaire')
export class QuestionnaireController {
  constructor(
    private readonly questionnaireService: QuestionnaireService,
    private readonly entityQuestionnaireService: EntityQuestionnaireService
  ) { }

  @MessagePattern(QUESTIONNAIRE_PATTERN.CREATE)
  async create(@Payload() createQuestionnaireDto: CreateQuestionnaireDto) {
    try {
      // Ccreate the questionnaire and its questions
      const newQuestionnaire = await this.questionnaireService.create(createQuestionnaireDto);

      // create entity-questionnaire records for each answer of each question
      await this.entityQuestionnaireService.createEntityQuestionnaireRecords(newQuestionnaire.questions);

      // return the created questionnaire along with its questions
      return newQuestionnaire;
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

  @MessagePattern(QUESTIONNAIRE_PATTERN.GET_ENTITY_RESPONSES)
  async fetchGroupedQuestionnaireData(@Payload() payload: { pageOptionsDto: PageOptionsDto; entityId?: string []}) {
    try {
      const { pageOptionsDto, entityId } = payload;
      const { result, queryBuilder } = await this.entityQuestionnaireService.queryEntityQuestionnaire(entityId);

      // get item count for pagination
      const itemCount = await queryBuilder.getCount();

      // generate page metadata
      const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

      // return paginated results
      return new PageDto(result, pageMetaDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || 'Error fetching questionnaire responses!',
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
  async update(@Payload() updateQuestionnaireDto: UpdateQuestionnaireDto) {
    try {
      return await this.questionnaireService.update(updateQuestionnaireDto.questionnaire_id, updateQuestionnaireDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || `Error updating questionnaire with id: ${updateQuestionnaireDto.questionnaire_id}`,
      });
    }
  }

  @MessagePattern(QUESTIONNAIRE_PATTERN.DELETE)
  async remove(@Payload() id: string) {
    try {

      return await this.questionnaireService.remove(id);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || `Error removing questionnaire with id: ${id}`,
      });
    }
  }

}
