import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

// services
import { QuestionsService } from './questions.service';
import { EntityQuestionnaireService } from '../entity_questionnaire/entity-questionnaire.service';

// contracts
import { CreateQuestionDto, UpdateQuestionDto, QUESTION_PATTERN } from '@app/contracts';

// dto
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

@Controller('questions')
export class QuestionsController {
  constructor(
    private readonly questionsService: QuestionsService,
    private readonly entityQuestionnaireService: EntityQuestionnaireService
) { }

  @MessagePattern(QUESTION_PATTERN.CREATE)
  async create(@Payload() createQuestionDto: CreateQuestionDto) {
    try {
      const newQuestions = await this.questionsService.create(createQuestionDto);
      
      // create entity-questionnaire records for each answer of each question
      await this.entityQuestionnaireService.createEntityQuestionnaireRecords([newQuestions]);

      return newQuestions;
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || 'Error creating questions!',
      });
    }
  }

  @MessagePattern(QUESTION_PATTERN.FIND_ALL)
  async findAll(@Payload() pageOptionsDto: PageOptionsDto) {
    try {
      return await this.questionsService.findAll(pageOptionsDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || 'Error fetching questions!',
      });
    }
  }

  @MessagePattern(QUESTION_PATTERN.FIND_ONE)
  async findOne(@Payload() id: string) {
    try {
      return await this.questionsService.findOne(id);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || `Error fetching questions with id: ${id}`,
      });
    }
  }

  @MessagePattern(QUESTION_PATTERN.UPDATE)
  update(@Payload() updateQuestionDto: UpdateQuestionDto) {
    try {
      return this.questionsService.update(updateQuestionDto.question_id, updateQuestionDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || `Error updating questions with id: ${updateQuestionDto.question_id}`,
      });
    }
  }

  @MessagePattern(QUESTION_PATTERN.DELETE)
  remove(@Payload() id: string) {
    return this.questionsService.remove(id);
  }
}
