import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

// entity
import { Answer } from '../answers/entities/answer.entity';
import { EntityQuestionnaire } from './entities/entity-questionnaire.entity';

// contracts
import { EntityQuestionnaireDto, CreateEntityQuestionnaireDto, UpdateEntityQuestionnaireDto } from '@app/contracts';

// page-meta
import { PageDto } from 'apps/common/dto/page.dto';
import { PageMetaDto } from 'apps/common/dto/page-meta.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

@Injectable()
export class EntityQuestionnaireService {
  constructor(
    @InjectRepository(EntityQuestionnaire) private entityQuestionnaireRepository: Repository<EntityQuestionnaire>,
    @InjectRepository(Answer) private answerRepository: Repository<Answer>
  ) { }

  async create(createEntityQuestionnaireDto: CreateEntityQuestionnaireDto []): Promise<EntityQuestionnaire[]> {

   
    for (const item of createEntityQuestionnaireDto) {
      if (item.entity_type === 'user') {
        // check and handle "short_text" or "long_text" answer types
        if (['short_text', 'long_text'].includes(item.answer_type)) {
          const newAnswer = this.answerRepository.create({
            content: item.content,
            answer_type: item.answer_type
          });

          const savedAnswer = await this.answerRepository.save(newAnswer);

          // update `answer_id` in the DTO with the newly created `answer_id`
          item.answer_id = savedAnswer.answer_id;
          item.entity_id = item.entity_id
        }

        // delete existing entity-questionnaire entries
        await this.entityQuestionnaireRepository.delete({
          questionnaire_id: item.questionnaire_id,
          question_id: item.question_id,
          entity_id: item.entity_id,
        });

      }
    }

    // create new entries in the database
    const newEntityQuestionnaires = await this.entityQuestionnaireRepository.create(createEntityQuestionnaireDto);
    const savedEntities = await this.entityQuestionnaireRepository.save(newEntityQuestionnaires);

    // Fetch the transformed entity data
    let savedEntityVal = savedEntities[0]?.entity_id ? [savedEntities[0].entity_id] : [savedEntities.entity_id]

    const { result } = await this.queryEntityQuestionnaire(savedEntities ? savedEntityVal : null);

    return result;
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<EntityQuestionnaireDto>> {
    const options = plainToInstance(PageOptionsDto, pageOptionsDto);
    const queryBuilder = this.entityQuestionnaireRepository.createQueryBuilder('entityquestionnaire');

    queryBuilder
      .orderBy('entityquestionnaire.created_at', pageOptionsDto.order)
      .skip(options.skip)
      .take(options.limit);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: string): Promise<EntityQuestionnaireDto> {
    const entityquestionnaire = await this.findEntityById(id);

    return plainToInstance(EntityQuestionnaireDto, entityquestionnaire, { excludeExtraneousValues: false });
  }

  async update(id: string, updateEntityQuestionnaireDto: UpdateEntityQuestionnaireDto): Promise<EntityQuestionnaireDto> {
    const entityquestionnaire = await this.findEntityById(id);

    // merge the updates into the entityquestionnaire entity
    const updateEntityQuestionnaire = this.entityQuestionnaireRepository.merge(entityquestionnaire, updateEntityQuestionnaireDto);
    await this.entityQuestionnaireRepository.save(updateEntityQuestionnaire);

    return plainToInstance(EntityQuestionnaireDto, updateEntityQuestionnaire, { excludeExtraneousValues: false });
  }

  async remove(id: string): Promise<void> {
    const entityquestionnaire = await this.findEntityById(id);
    await this.entityQuestionnaireRepository.remove(entityquestionnaire);
  }

  async createEntityQuestionnaireRecords(questions: any[]): Promise<void> {
    const entityQuestionnairePromises = questions.flatMap((question) => {
      return question.answers.map((answer) => {

        let entityRecord = plainToInstance(CreateEntityQuestionnaireDto,  {
          entity_id: answer.answer_id,
          entity_type: "questions",
          questionnaire_id: question.questionnaire_id,
          answer_id: answer.answer_id,
          question_id: question.question_id,
          mark_as_read: false,
        }, { excludeExtraneousValues: false });
        return this.create([entityRecord]);
      });
    });

    // wait for all entity-questionnaire records to be created
    await Promise.all(entityQuestionnairePromises);
  }

  async queryEntityQuestionnaire(entityIds: string[]): Promise<{
    result: any[];
    queryBuilder: any;
  }> {
    const queryBuilder = this.entityQuestionnaireRepository
      .createQueryBuilder('entity_questionnaire')
      .leftJoinAndSelect('entity_questionnaire.questionnaire', 'questionnaire')
      .leftJoinAndSelect('entity_questionnaire.question', 'question')
      .leftJoinAndSelect('entity_questionnaire.answer', 'answer')
      .where('entity_questionnaire.entity_type = :entityType', { entityType: 'user' })
      .orderBy('questionnaire.created_at', 'DESC');

    // handle multiple entityIds
    if (entityIds && entityIds.length > 0) {
      queryBuilder.andWhere('entity_questionnaire.entity_id IN (:...entityIds)', { entityIds });
    }

    // execute the query to get records
    const entityQuestionnaireRecords = await queryBuilder.getMany();

    // transform data into grouped format
    const groupedData = this.transformEntityQuestionnaireRecords(entityQuestionnaireRecords);

    // convert grouped data into an array format
    const result = Object.values(groupedData).map((userEntry: any) => ({
      user_id: userEntry.user_id,
      questionnaires: Object.values(userEntry.questionnaires).map(
        (questionnaire: any) => ({
          ...questionnaire,
          questions: Object.values(questionnaire.questions),
        }),
      ),
    }));

    return { result, queryBuilder };
  }

  private transformEntityQuestionnaireRecords(records: any[]): Record<string, any> {
    const groupedData = {};

    for (const record of records) {
      const userId = record.entity_id;
      const questionnaireId = record.questionnaire.questionnaire_id;
      const questionId = record.question.question_id;

      // initialize user entry if not present
      if (!groupedData[userId]) {
        groupedData[userId] = {
          user_id: userId,
          questionnaires: {},
        };
      }

      // initialize questionnaire under the user
      if (!groupedData[userId].questionnaires[questionnaireId]) {
        groupedData[userId].questionnaires[questionnaireId] = {
          questionnaire_id: record.questionnaire.questionnaire_id,
          title: record.questionnaire.title,
          description: record.questionnaire.description,
          publish_for_registration: record.questionnaire.publish_for_registration,
          published: record.questionnaire.published,
          created_at: record.questionnaire.created_at,
          updated_at: record.questionnaire.updated_at,
          number_of_responses: record.questionnaire.number_of_responses,
          read: record.mark_as_read || false,
          tag: record.questionnaire.tag || null,
          questions: {},
        };
      }

      const questionnaire = groupedData[userId].questionnaires[questionnaireId];

      // initialize question under the questionnaire
      if (!questionnaire.questions[questionId]) {
        questionnaire.questions[questionId] = {
          question_id: questionId,
          content: record.question.content,
          question_type: record.question.question_type,
          answers: [],
        };
      }

      // add the answer to the respective question
      questionnaire.questions[questionId].answers.push({
        answer_id: record.answer.answer_id,
        content: record.answer.content,
        answer_type: record.answer.answer_type,
        mark_as_read: record.mark_as_read,
        entity_questionnaire_id: record.entity_questionnaire_id,
      });
    }

    return groupedData;
  }

  private async findEntityById(id: string): Promise<EntityQuestionnaire> {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid UUID: ${id}`);
    }

    const entityquestionnaire = await this.entityQuestionnaireRepository.findOne({ where: { entity_questionnaire_id: id } });

    if (!entityquestionnaire) {
      throw new NotFoundException(`EntityQuestionnaire with ID ${id} not found`);
    }

    return entityquestionnaire;
  }

}
