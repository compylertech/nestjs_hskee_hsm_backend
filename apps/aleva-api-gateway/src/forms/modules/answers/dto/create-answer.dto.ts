import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

// contracts
import { AnswerType } from '@app/contracts';

export class CreateAnswerDto {
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
