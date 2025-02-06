import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateEntityQuestionnaireDto {
  @ApiProperty({
    description: 'ID of the entity questionnaire relationship',
    example: '6bbe14a9-2dfd-488a-a372-6428895a7625',
  })
  @IsString()
  @IsOptional()
  entity_questionnaire_id?: string;

  @ApiProperty({ description: 'Entity ID (e.g., user, question, answer)', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  @IsOptional()
  entity_id?: string;

  @ApiProperty({
    description: 'Type of entity (e.g., user, questions, questionnaires, answers)',
    example: 'user',
  })
  @IsString()
  entity_type: string;

  @ApiProperty({
    description: 'Questionnaire ID associated with this entity',
    example: '6bbe14a9-2dfd-488a-a372-6428895a7625',
  })
  @IsString()
  @IsOptional()
  questionnaire_id?: string;

  @ApiProperty({
    description: 'Question ID associated with this entity',
    example: '6bbe14a9-2dfd-488a-a372-6428895a7625',
  })
  @IsString()
  @IsOptional()
  question_id?: string;

  @ApiProperty({
    description: 'Answer ID associated with this entity',
    example: '6bbe14a9-2dfd-488a-a372-6428895a7625',
  })
  @IsString()
  @IsOptional()
  answer_id?: string;

  @ApiProperty({
    description:  'Type of answer (e.g., short_text, multichoice, long_text, checkbox)',
    example: 'short_text',
  })
  @IsString()
  @IsOptional()
  answer_type?: string;
  
  @ApiProperty({
    description:  'Content of a text response',
    example: 'This is an answer',
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({
    description: 'Indicates if this entity-questionnaire relationship is marked as read',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  mark_as_read?: boolean;
}
