import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

// dto
import { CreateQuestionDto } from '../../questions/dto/create-question.dto';

export class CreateQuestionnaireDto {
  @ApiProperty({ description: 'Title of the questionnaire', example: 'Cleaning' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Description of the questionnaire', example: 'Dope' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'List of questions associated with the questionnaire',
    type: [CreateQuestionDto],
    example: [{
      "content": "What is your favorite color?",
      "question_type": "short_text",
      "questionnaire_id": "d1b9d7c2-8e34-42b3-9bfe-123456789abc",
      "answers": [
        {
          "answer_type": "short_text",
          "content": "Red"
        }
      ]
    }],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  @IsOptional()
  questions?: CreateQuestionDto[];

  @ApiProperty({ description: 'Indicates if the questionnaire is published for registration', example: false })
  @IsBoolean()
  @IsOptional()
  publish_for_registration?: boolean;

  @ApiProperty({ description: 'Indicates if the questionnaire is published', example: false })
  @IsBoolean()
  @IsOptional()
  published?: boolean;
}
