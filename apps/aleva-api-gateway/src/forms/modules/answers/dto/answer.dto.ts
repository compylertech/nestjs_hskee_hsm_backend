import { ApiProperty } from '@nestjs/swagger';

// contracts
import { AnswerType } from '@app/contracts';

export class AnswerDto {
  @ApiProperty({ description: 'ID of the answer', example: 'f9771421-0f66-48a6-b471-d527d635ff73' })
  answer_id: string;

  @ApiProperty({
    description: 'Type of the answer',
    enum: AnswerType,
    example: AnswerType.SHORT_TEXT,
  })
  answer_type: AnswerType;
  
  @ApiProperty({ description: 'Content of the answer', example: 'My answer to the question' })
  content: string;

  @ApiProperty({ description: 'Timestamp when the answer was created', example: '2024-06-15T08:00:00Z' })
  created_at: Date;

  @ApiProperty({ description: 'Timestamp when the answer was last updated', example: '2024-06-15T09:00:00Z' })
  updated_at: Date;
}
