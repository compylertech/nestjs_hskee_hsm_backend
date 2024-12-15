import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';


export class CreateAttendanceLogDto {
  @ApiProperty({ description: '', example: '' })
  @IsString()
  check_in_time: string;

  @ApiProperty({ description: '', example: '' })
  @IsString()
  check_out_time: string;

  @ApiProperty({ description: '', example: '' })
  @IsOptional()
  user_id?: string;
}
