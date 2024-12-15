import { ApiProperty } from "@nestjs/swagger";

export class AttendanceLogDto {
    @ApiProperty({ description: '', example: '' })
    check_in_time: string;
  
    @ApiProperty({ description: '', example: '' })
    check_out_time: string;
  
    @ApiProperty({ description: '', example: '' })
    user_id: string;
}
