import { ApiProperty } from '@nestjs/swagger';

export class AttendanceLogDto {
    @ApiProperty({ description: 'ID of the attendance log', example: 'f9771421-0f66-48a6-b471-d527d635ff73' })
    attendance_log_id: string;

    @ApiProperty({
        description: 'The check-in time in ISO format',
        example: '2024-08-22T17:17:54.520190',
    })
    check_in_time: string;

    @ApiProperty({
        description: 'The check-out time in ISO format',
        example: '2024-08-22T18:17:54.520190',
    })
    check_out_time: string;

    @ApiProperty({
        description: 'The unique identifier of the user',
        example: '0d394844-4df0-4337-8dfc-ff79cc15be17',
    })
    user_id: string;
}

export class GuestAttendanceLogDto {
    @ApiProperty({ description: 'Email of the user', example: 'daniel.q@compyler.io' })
    email: string;

    @ApiProperty({
        description: 'The type of attendance',
        example: 'check_in',
    })
    attendance_type: string;
}