import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';

// dto
import { CreateAttendanceLogDto } from './create-attendance-log.dto';

export class UpdateAttendanceLogDto extends PartialType(CreateAttendanceLogDto) {
  @ApiProperty({ description: '', example: '' })
  @IsOptional()
  @IsString()
  check_in_time: string;

  @ApiProperty({ description: '', example: '' })
  @IsOptional()
  @IsString()
  check_out_time: string;

  @ApiProperty({ description: '', example: '' })
  @IsOptional()
  user_id?: string;
}