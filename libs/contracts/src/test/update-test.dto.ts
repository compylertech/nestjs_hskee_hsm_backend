import { PartialType } from '@nestjs/mapped-types';
import { CreateTestDto } from './create-test.dto';

export class UpdateTestDto extends PartialType(CreateTestDto) {
  id: number;
  title: string;
  author: string;
  rating: number;
}
