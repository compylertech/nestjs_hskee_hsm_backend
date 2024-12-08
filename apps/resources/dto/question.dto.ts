import { ApiProperty } from '@nestjs/swagger';
import { AnswerDto } from './answer.dto';

export class QuestionDto {
  @ApiProperty({ description: 'Question ID', example: '4416269b-739f-4843-ad9d-27b3299a4638' })
  question_id: string;

  @ApiProperty({ description: 'Question type', example: 'short_text' })
  question_type: string;

  @ApiProperty({ description: 'Content of the question', example: 'How old are you?' })
  content: string;

  @ApiProperty({ description: 'Answers for the question', type: [AnswerDto] })
  answers: AnswerDto[];
}
