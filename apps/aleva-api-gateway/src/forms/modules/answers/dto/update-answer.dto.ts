import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

// dto
import { CreateAnswerDto } from './create-answer.dto';

// contract
import { AnswerType } from '@app/contracts';

export class UpdateAnswerDto extends PartialType(CreateAnswerDto) {
  @ApiProperty({ description: 'ID of the answer to update', example: 'f9771421-0f66-48a6-b471-d527d635ff73' })
  @IsString()
  @IsOptional()
  answer_id?: string;

  @ApiProperty({
    description: 'Type of the answer',
    enum: AnswerType,
    example: AnswerType.SHORT_TEXT,
  })
  @IsEnum(AnswerType)
  @IsNotEmpty()
  answer_type: AnswerType;

  @ApiProperty({ description: 'Content of the answer', example: 'My answer to the question' })
  @IsString()
  @IsOptional()
  content: string;
}
