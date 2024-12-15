import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, ValidateNested, IsEnum, IsNotEmpty } from 'class-validator';

// dto
import { UpdateAnswerDto } from '../../answers/dto/update-answer.dto';

// contracts
import { QuestionType } from '@app/contracts';

export class UpdateQuestionDto {
  @ApiProperty({ description: 'ID of the question to update', example: 'c1b9d7c2-8e34-42b3-9bfe-123456789def' })
  @IsString()
  @IsOptional()
  question_id?: string;

  @ApiProperty({ description: 'Content of the question', example: 'What is your favorite color?' })
  @IsString()
  @IsOptional()
  content?: string;

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
    type: [UpdateAnswerDto],
    example: [{ answer_type: 'short_text', content: 'Blue' }],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateAnswerDto)
  @IsOptional()
  answers?: UpdateAnswerDto[];
}
