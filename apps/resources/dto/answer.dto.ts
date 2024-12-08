import { ApiProperty } from '@nestjs/swagger';

export class AnswerDetailsDto {
  @ApiProperty({ description: 'Entity ID associated with the answer', example: '5c3e3e10-0467-4466-86db-412987e75b0e' })
  entity_id: string;

  @ApiProperty({ description: 'Type of entity', example: 'user' })
  entity_type: string;

  @ApiProperty({ description: 'Whether the answer is marked as read', example: false })
  mark_as_read: boolean;

  @ApiProperty({ description: 'Entity questionnaire ID', example: '670a86b5-1df0-41f4-85a1-71f21aa2dcd2' })
  entity_questionnaire_id: string;
}

export class AnswerDto {
  @ApiProperty({ description: 'Answer ID', example: '8f9380c7-554e-4254-882b-09a0422a8f2f' })
  answer_id: string;

  @ApiProperty({ description: 'Type of the answer', example: 'short_text' })
  answer_type: string;

  @ApiProperty({ description: 'Content of the answer', example: '10' })
  content: string;

  @ApiProperty({ description: 'Details associated with the answer', type: [AnswerDetailsDto] })
  details: AnswerDetailsDto[];
}
