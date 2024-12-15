import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// dto
import { AnswerDto } from '../../answers/dto/answer.dto';

// contracts
import { QuestionType } from '@app/contracts';

export class QuestionDto {
  @ApiProperty({ description: 'ID of the question', example: 'c1b9d7c2-8e34-42b3-9bfe-123456789def' })
  question_id: string;

  @ApiProperty({ description: 'Content of the question', example: 'What is your favorite color?' })
  content: string;

  @ApiProperty({
    description: 'Type of the question',
    enum: QuestionType,
    example: QuestionType.SHORT_TEXT,
  })
  question_type: QuestionType;


  @ApiProperty({ description: 'ID of the associated questionnaire', example: 'd1b9d7c2-8e34-42b3-9bfe-123456789abc' })
  questionnaire_id: string;

  @ApiProperty({
    description: 'List of answers for the question',
    type: [AnswerDto],
    example: [
      { answer_id: '1', answer_type: 'short_text', content: 'Red' },
      { answer_id: '2', answer_type: 'short_text', content: 'Blue' },
    ],
  })
  @IsOptional()
  answers?: AnswerDto[];
}
