import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDate, IsEmail, IsOptional, IsString, ValidateNested } from 'class-validator';

// dto
import { EntityQuestionnaireDto } from './entity-questionnaire.dto';
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

  @ApiProperty({
    description: 'List of answers associated with the user',
    type: [EntityQuestionnaireDto],
    example: [
      {
        answer_id: "be583bfd-4609-4a64-a156-e7ab9b45337a",
        answer_type: "text",
        content: "Case some letter north.",
        entity_type: "user",
        mark_as_read: false,
        question_id: "f7a0fe99-12b6-4dee-a14f-dd318d984b73",
        questionnaire_id: "6a8e0f5e-2653-4ee9-9b56-711133afaf4c"
      }
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EntityQuestionnaireDto)
  @IsOptional()
  answers?: EntityQuestionnaireDto[];
}