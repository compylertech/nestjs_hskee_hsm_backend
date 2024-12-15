import { PartialType } from '@nestjs/mapped-types';
import { CreateAttendanceLogDto } from './create-attendance-log.dto';

export class UpdateAttendanceLogDto extends PartialType(CreateAttendanceLogDto) {
  answer_id?: string;
}
