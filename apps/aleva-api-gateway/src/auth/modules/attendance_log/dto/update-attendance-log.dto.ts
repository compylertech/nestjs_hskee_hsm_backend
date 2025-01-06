import {
  IsUUID,
  IsDate,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAttendanceLogDto {
  @ApiProperty({
    description: 'The check-in time in ISO format',
    example: '2024-08-22T17:17:54.520190',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  check_in_time?: Date;

  @ApiProperty({
    description: 'The check-out time in ISO format',
    required: false,
    example: '2024-08-22T18:17:54.520190',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  check_out_time?: Date;

  @ApiProperty({
    description: 'The unique identifier of the user',
    example: '0d394844-4df0-4337-8dfc-ff79cc15be17',
  })
  @IsOptional()
  @IsUUID()
  user_id?: string;
}
