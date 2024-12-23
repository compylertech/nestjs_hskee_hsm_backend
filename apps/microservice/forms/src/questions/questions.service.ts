import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

// entity
import { Question } from './entities/questions.entity';

// contracts
import { QuestionDto, CreateQuestionDto, UpdateQuestionDto } from '@app/contracts';

// page-meta
import { PageDto } from 'apps/common/dto/page.dto';
import { PageMetaDto } from 'apps/common/dto/page-meta.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

@Injectable()
export class QuestionsService {
  constructor(@InjectRepository(Question) private questionsRepository: Repository<Question>) { }


  async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
    const newQuestions = this.questionsRepository.create(createQuestionDto);

    return this.questionsRepository.save(newQuestions);
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<QuestionDto>> {
    const options = plainToInstance(PageOptionsDto, pageOptionsDto);
    const queryBuilder = this.questionsRepository.createQueryBuilder('questions');


    queryBuilder
      .leftJoinAndSelect('questions.answers', 'answers')
      .leftJoin('entity_questionnaire', 'eq', 'eq.question_id = questions.question_id')
      .where('eq.entity_type = :entityType', { entityType: 'questions' })
      .andWhere('eq.question_id IS NOT NULL')
      .andWhere('eq.answer_id = answers.answer_id')
      .orderBy('questions.created_at', pageOptionsDto.order)
      .skip(options.skip)
      .take(options.limit);


    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    const transformedEntities = plainToInstance(QuestionDto, entities, { excludeExtraneousValues: false });

    return new PageDto(transformedEntities, pageMetaDto);
  }

  async findOne(id: string): Promise<QuestionDto> {
    const queryBuilder = this.questionsRepository.createQueryBuilder('questions');

    queryBuilder
      .leftJoinAndSelect('questions.answers', 'answers')
      .leftJoin('entity_questionnaire', 'eq', 'eq.question_id = questions.question_id')
      .where({ question_id: id })
      .andWhere('eq.entity_type = :entityType', { entityType: 'questions' })
      .andWhere('eq.question_id IS NOT NULL')
      .andWhere('eq.answer_id = answers.answer_id');
    
    const { entities } = await queryBuilder.getRawAndEntities();

    return plainToInstance(QuestionDto, entities[0], { excludeExtraneousValues: false });
  }

  async update(id: string, updateQuestionDto: UpdateQuestionDto): Promise<QuestionDto> {
    const questions = await this.findEntityById(id);

    // merge the updates into the questions entity
    const updateQuestions = this.questionsRepository.merge(questions, updateQuestionDto);
    await this.questionsRepository.save(updateQuestions);

    return plainToInstance(QuestionDto, updateQuestions, { excludeExtraneousValues: false });
  }

  async remove(id: string): Promise<void> {
    const questions = await this.findEntityById(id);
    await this.questionsRepository.remove(questions);
  }

  private async findEntityById(id: string): Promise<Question> {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid UUID: ${id}`);
    }

    const questions = await this.questionsRepository.findOne({ where: { question_id: id } });

    if (!questions) {
      throw new NotFoundException(`Questions with ID ${id} not found`);
    }

    return questions;
  }
}
