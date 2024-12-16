import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

// entity
import { Answer } from './entities/answer.entity';

// contracts
import { AnswerDto, CreateAnswerDto, UpdateAnswerDto } from '@app/contracts';

// page-meta
import { PageDto } from 'apps/common/dto/page.dto';
import { PageMetaDto } from 'apps/common/dto/page-meta.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

@Injectable()
export class AnswerService {
  constructor(@InjectRepository(Answer) private answerRepository: Repository<Answer>) { }


  async create(createAnswerDto: CreateAnswerDto): Promise<Answer> {
    const newAnswer = this.answerRepository.create(createAnswerDto);

    return this.answerRepository.save(newAnswer);
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<AnswerDto>> {
    const options = plainToInstance(PageOptionsDto, pageOptionsDto);
    const queryBuilder = this.answerRepository.createQueryBuilder('answer');
    
    queryBuilder
      .orderBy('answer.created_at', pageOptionsDto.order)
      .skip(options.skip)
      .take(options.limit);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    const transformedEntities = plainToInstance(AnswerDto, entities, { excludeExtraneousValues: false });

    return new PageDto(transformedEntities, pageMetaDto);
  }

  async findOne(id: string): Promise<AnswerDto> {
    const answer = await this.findEntityById(id);

    return plainToInstance(AnswerDto, answer, { excludeExtraneousValues: false });
  }

  async update(id: string, updateAnswerDto: UpdateAnswerDto): Promise<AnswerDto> {
    const answer = await this.findEntityById(id);

    // merge the updates into the answer entity
    const updateAnswer = this.answerRepository.merge(answer, updateAnswerDto);
    await this.answerRepository.save(updateAnswer);

    return plainToInstance(AnswerDto, updateAnswer, { excludeExtraneousValues: false });
  }

  async remove(id: string): Promise<void> {
    const answer = await this.findEntityById(id);
    await this.answerRepository.remove(answer);
  }

  private async findEntityById(id: string): Promise<Answer> {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid UUID: ${id}`);
    }

    const answer = await this.answerRepository.findOne({ where: { answer_id: id } });

    if (!answer) {
      throw new NotFoundException(`Answer with ID ${id} not found`);
    }

    return answer;
  }
}
