import { ApiProperty } from "@nestjs/swagger";

export class AttendanceLogDto {
    @ApiProperty({ description: 'Attendance log ID', example: 'cfbedc1e-f57f-47f9-b81b-357e1987ca9d' })
    attendance_id: string;
  
    @ApiProperty({ description: 'Check-in time', example: '2024-08-27T19:53:14.920837Z' })
    check_in_time: Date;
  
    @ApiProperty({ description: 'Check-out time', example: '2024-11-13T19:08:18.376241Z' })
    check_out_time: Date;
  
    @ApiProperty({ description: 'Date stamp', example: '2024-11-12T21:08:44.877971Z' })
    date_stamp: Date;
  }
  