import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, ValidateNested, IsOptional, IsEnum } from 'class-validator';

// dto
import { CreateAnswerDto } from '../../answers/dto/create-answer.dto';

// contracts
import { QuestionType } from '@app/contracts';

export class CreateQuestionDto {
  @ApiProperty({ description: 'Content of the question', example: 'What is your favorite color?' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'Type of the question',
    enum: QuestionType,
    example: QuestionType.SHORT_TEXT,
  })
  @IsEnum(QuestionType)
  @IsNotEmpty()
  question_type: QuestionType;

  @ApiProperty({ description: 'ID of the associated questionnaire', example: 'd1b9d7c2-8e34-42b3-9bfe-123456789abc' })
  @IsString()
  @IsOptional()
  questionnaire_id?: string;

  @ApiProperty({
    description: 'List of answers for the question',
    type: [CreateAnswerDto],
    example: [{ answer_type: 'short_text', content: 'Red' }],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAnswerDto)
  @IsOptional()
  answers?: CreateAnswerDto[];
}
