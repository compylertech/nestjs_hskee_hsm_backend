import { ApiProperty } from '@nestjs/swagger';
import { QuestionDto } from './question.dto';

export class QuestionnaireDto {
  @ApiProperty({ description: 'Questionnaire ID', example: '29af4056-569b-410e-a1fe-7e330e9beb2f' })
  questionnaire_id: string;

  @ApiProperty({ description: 'Title of the questionnaire', example: 'Testing from the frontend' })
  title: string;

  @ApiProperty({ description: 'Number of responses', example: 5 })
  number_of_responses: number;

  @ApiProperty({ description: 'Whether it is published for registration', example: true })
  publish_for_registration: boolean;

  @ApiProperty({ description: 'Whether it is published', example: true })
  published: boolean;

  @ApiProperty({ description: 'Description of the questionnaire', example: 'description101' })
  description: string;

  @ApiProperty({ description: 'Questions in the questionnaire', type: [QuestionDto] })
  questions: QuestionDto[];
}
