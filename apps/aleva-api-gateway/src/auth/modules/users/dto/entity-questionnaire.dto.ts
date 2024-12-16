import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, ValidateNested, IsArray } from 'class-validator';
import { QuestionnaireDto } from 'apps/aleva-api-gateway/src/forms/modules/questionnaire/dto/questionnaire.dto';

export class EntityQuestionnaireDto {
  @ApiProperty({ description: 'Indicates if the entity-questionnaire relationship is marked as read', example: true })
  @IsBoolean()
  @IsOptional()
  mark_as_read?: boolean;

  @ApiProperty({
    description: 'Type of entity (e.g., user, questions, questionnaires, answers)',
    example: 'answers',
  })
  @IsString()
  @IsOptional()
  entity_type?: string;

  @ApiProperty({ description: 'ID of the entity (e.g., user, question, answer)', example: '4416269b-739f-4843-ad9d-27b3299a4638' })
  @IsString()
  @IsOptional()
  entity_id?: string;

  @ApiProperty({
    description: 'List of questionnaires associated with the entity',
    type: [QuestionnaireDto],
    example: [
      {
        title: 'Testing from the frontend',
        description: 'description101',
        questions: [
          {
            question_id: '4416269b-739f-4843-ad9d-27b3299a4638',
            questionnaire_id: '29af4056-569b-410e-a1fe-7e330e9beb2f',
            content: 'how old are you?',
            question_type: 'short_text',
            answers: [
              {
                answer_id: '61ddbca3-e0f6-4fcd-af48-e9b98ab42f83',
                questionnaire_id: '29af4056-569b-410e-a1fe-7e330e9beb2f',
                question_id: '4416269b-739f-4843-ad9d-27b3299a4638',
                answer_type: 'short_text',
                content: 'twenty',
                mark_as_read: false,
              },
            ],
          },
        ],
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionnaireDto)
  questionnaires: QuestionnaireDto[];
}
