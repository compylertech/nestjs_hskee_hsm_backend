import { PartialType } from '@nestjs/mapped-types';

// dto
import { CreateQuestionDto } from './create-question.dto';

export class UpdateQuestionDto extends PartialType(CreateQuestionDto) {
  id: number;
  title?: string;
  author?: string;
  rating?: number;
}
