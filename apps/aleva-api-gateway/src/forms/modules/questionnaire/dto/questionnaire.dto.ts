import { ApiProperty } from '@nestjs/swagger';

// dto
import { QuestionDto } from '../../questions/dto/question.dto';

export class QuestionnaireDto {
  @ApiProperty({ description: 'ID of the questionnaire', example: '6bbe14a9-2dfd-488a-a372-6428895a7625' })
  questionnaire_id: string;

  @ApiProperty({ description: 'Title of the questionnaire', example: 'Cleaning' })
  title: string;

  @ApiProperty({ description: 'Description of the questionnaire', example: 'Dope' })
  description: string;

  @ApiProperty({
    description: 'List of questions in the questionnaire',
    type: [QuestionDto],
    example: [],
  })
  questions: QuestionDto[];

  @ApiProperty({
    description: 'Indicates if the questionnaire is published for registration',
    example: false,
  })
  publish_for_registration: boolean;

  @ApiProperty({ description: 'Indicates if the questionnaire is published', example: false })
  published: boolean;

  @ApiProperty({ description: 'Timestamp when the questionnaire was created', example: '2024-11-22T12:08:51.120400Z' })
  created_at: Date;

  @ApiProperty({ description: 'Timestamp when the questionnaire was last updated', example: '2024-11-22T12:08:51.120413Z' })
  updated_at: Date;

  @ApiProperty({ description: 'Number of responses to the questionnaire', example: 0 })
  number_of_responses: number;
}
