import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsEmail, IsOptional, IsString, ValidateNested } from 'class-validator';

// dto
import { UserAuthInfoDto, UserEmergencyInfoDto } from './user-utils.dto';
import { UpdateAttendanceLogDto } from '../../attendance_log/dto/update-attendance-log.dto';

export class UpdateUserDto {
  @ApiProperty({ description: 'First name of the user', example: 'John' })
  @IsOptional()
  @IsString()
  first_name?: string;

  @ApiProperty({ description: 'Last name of the user', example: 'Doe' })
  @IsOptional()
  @IsString()
  last_name?: string;

  @ApiProperty({ description: 'Gender of the user', example: 'male' })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty({ description: 'User password', example: '$trongP@ssword' })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({ description: 'Date of birth', example: '2024-11-26' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date_of_birth?: Date;

  @ApiProperty({ description: 'Email address of the user', example: 'johndoe@compyler.io' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Phone number of the user', example: '233123456789' })
  @IsOptional()
  @IsString()
  phone_number?: string;

  @ApiProperty({ description: 'Identification number of the user', example: 'GHA-123456789-0' })
  @IsOptional()
  @IsString()
  identification_number?: string;

  @ApiProperty({ description: 'URL of the user photo', example: '', nullable: true })
  @IsOptional()
  @IsString()
  photo_url?: string;

  @ApiProperty({ description: 'User authentication information', type: UserAuthInfoDto })
  @IsOptional()
  @Type(() => UserAuthInfoDto)
  user_auth_info?: UserAuthInfoDto;

  @ApiProperty({ description: 'User emergency contact information', type: UserEmergencyInfoDto })
  @IsOptional()
  @Type(() => UserEmergencyInfoDto)
  user_emergency_info?: UserEmergencyInfoDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateAttendanceLogDto)
  @IsOptional()
  attendance_logs?: UpdateAttendanceLogDto[];
}