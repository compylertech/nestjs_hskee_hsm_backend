import { PartialType } from '@nestjs/mapped-types';

// dto
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  id: number;
  title: string;
  author: string;
  rating: number;
}
