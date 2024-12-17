import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

// entity
import { Questionnaire } from './entities/questionnaire.entity';

// contracts
import { QuestionnaireDto, CreateQuestionnaireDto, UpdateQuestionnaireDto, UpdateEntityQuestionnaireDto, EntityQuestionnaireDto, CreateEntityQuestionnaireDto } from '@app/contracts';

// page-meta
import { PageDto } from 'apps/common/dto/page.dto';
import { PageMetaDto } from 'apps/common/dto/page-meta.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';
import { EntityQuestionnaire } from './entities/entity-questionnaire.entity';

@Injectable()
export class QuestionnaireService {
  constructor(
    @InjectRepository(Questionnaire) private questionnaireRepository: Repository<Questionnaire>,
    @InjectRepository(EntityQuestionnaire) private entityQuestionnaireRepository: Repository<EntityQuestionnaire>
  ) { }


  async create(createQuestionnaireDto: CreateQuestionnaireDto): Promise<Questionnaire> {
    const newQuestionnaire = this.questionnaireRepository.create(createQuestionnaireDto);

    return this.questionnaireRepository.save(newQuestionnaire);
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<QuestionnaireDto>> {
    const options = plainToInstance(PageOptionsDto, pageOptionsDto);
    const queryBuilder = this.questionnaireRepository.createQueryBuilder('questionnaire');

    queryBuilder
      .leftJoinAndSelect('questionnaire.questions', 'questions')
      .leftJoinAndSelect('questions.answers', 'answers')
      .orderBy('questionnaire.created_at', pageOptionsDto.order)
      .skip(options.skip)
      .take(options.limit);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    const transformedEntities = plainToInstance(QuestionnaireDto, entities, { excludeExtraneousValues: false });

    return new PageDto(transformedEntities, pageMetaDto);
  }

  async findOne(id: string): Promise<QuestionnaireDto[]> {
    const queryBuilder = this.questionnaireRepository.createQueryBuilder('questionnaire');

    queryBuilder
      .leftJoinAndSelect('questionnaire.questions', 'questions')
      .leftJoinAndSelect('questions.answers', 'answers')
      .where({questionnaire_id: id});

    const { entities } = await queryBuilder.getRawAndEntities();

    return plainToInstance(QuestionnaireDto, entities, { excludeExtraneousValues: false });
  }

  async update(id: string, updateQuestionnaireDto: UpdateQuestionnaireDto): Promise<QuestionnaireDto> {
    // const questionnaire = await this.findEntityById(id);
    const questionnaire = await this.questionnaireRepository.findOne({
      where: { questionnaire_id: id },
      relations: ['questions', 'questions.answers'],
    });

    // merge the updates into the questionnaire entity
    const updateQuestionnaire = this.questionnaireRepository.merge(questionnaire, updateQuestionnaireDto);
    await this.questionnaireRepository.save(updateQuestionnaire);

    return plainToInstance(QuestionnaireDto, updateQuestionnaire, { excludeExtraneousValues: false });
  }

  async remove(id: string): Promise<void> {
    const questionnaire = await this.findEntityById(id);
    await this.questionnaireRepository.remove(questionnaire);
  }

  private async findEntityById(id: string): Promise<Questionnaire> {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid UUID: ${id}`);
    }

    const questionnaire = await this.questionnaireRepository.findOne({ where: { questionnaire_id: id } });

    if (!questionnaire) {
      throw new NotFoundException(`Questionnaire with ID ${id} not found`);
    }

    return questionnaire;
  }

  /**
   * Create a new EntityQuestionnaire relationship
   */
  async createEntityQuestionnaire(createEntityQuestionnaireDto: CreateEntityQuestionnaireDto): Promise<EntityQuestionnaireDto> {
    const newEntityQuestionnaire = this.entityQuestionnaireRepository.create(createEntityQuestionnaireDto);

    const savedEntity = await this.entityQuestionnaireRepository.save(newEntityQuestionnaire);

    return plainToInstance(EntityQuestionnaireDto, savedEntity, { excludeExtraneousValues: false });
  }

  /**
   * Update an existing EntityQuestionnaire relationship
   */
  async updateEntityQuestionnaire(
    entityQuestionnaireId: string,
    updateEntityQuestionnaireDto: UpdateEntityQuestionnaireDto,
  ): Promise<EntityQuestionnaireDto> {
    if (!isUUID(entityQuestionnaireId)) {
      throw new BadRequestException(`Invalid UUID: ${entityQuestionnaireId}`);
    }

    const entityQuestionnaire = await this.entityQuestionnaireRepository.findOne({
      where: { entity_questionnaire_id: entityQuestionnaireId },
    });

    if (!entityQuestionnaire) {
      throw new NotFoundException(`EntityQuestionnaire with ID ${entityQuestionnaireId} not found`);
    }

    const updatedEntity = this.entityQuestionnaireRepository.merge(entityQuestionnaire, updateEntityQuestionnaireDto);
    await this.entityQuestionnaireRepository.save(updatedEntity);

    return plainToInstance(EntityQuestionnaireDto, updatedEntity, { excludeExtraneousValues: false });
  }
}
