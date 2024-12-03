import { PartialType } from '@nestjs/mapped-types';

// dto
import { CreateAnswerDto } from './create-answer.dto';

export class UpdateAnswerDto extends PartialType(CreateAnswerDto) {
  id: number;
  content?: string;
  likes?: number;
}
