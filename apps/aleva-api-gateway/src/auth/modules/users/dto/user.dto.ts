import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDate, IsOptional, ValidateNested, IsArray } from 'class-validator';

// contracts
import { AttendanceLogDto } from '@app/contracts';

// dtos
import { EntityQuestionnaireDto } from './entity-questionnaire.dto';
import { UserAuthInfoDto, UserEmergencyInfoDto } from './user-utils.dto';


export class UserDto {
  @ApiProperty({ description: 'User ID', example: '5c3e3e10-0467-4466-86db-412987e75b0e' })
  @IsString()
  user_id: string;

  @ApiProperty({ description: 'First name of the user', example: 'John' })
  @IsString()
  first_name: string;

  @ApiProperty({ description: 'Last name of the user', example: 'Doe' })
  @IsString()
  last_name: string;

  @ApiProperty({ description: 'Gender of the user', example: 'male' })
  @IsString()
  gender: string;

  @ApiProperty({ description: 'Date of birth', example: '2024-11-26' })
  @Type(() => Date)
  @IsDate()
  date_of_birth: Date;

  @ApiProperty({ description: 'Email address of the user', example: 'johndoe@compyler.io' })
  @IsString()
  email: string;

  @ApiProperty({ description: 'Phone number of the user', example: '233123456789' })
  @IsString()
  phone_number: string;

  @ApiProperty({ description: 'Identification number of the user', example: 'GHA-123456789-0' })
  @IsString()
  identification_number: string;

  @ApiProperty({ description: 'URL of the user photo', example: 'https://example.com/photo.jpg', nullable: true })
  @IsString()
  @IsOptional()
  photo_url?: string;

  @ApiProperty({ description: 'User authentication information', type: UserAuthInfoDto })
  @Type(() => UserAuthInfoDto)
  user_auth_info?: UserAuthInfoDto;

  @ApiProperty({ description: 'User emergency contact information', type: UserEmergencyInfoDto })
  @Type(() => UserEmergencyInfoDto)
  user_emergency_info?: UserEmergencyInfoDto;
  
  @ApiProperty({ 
    description: 'User attendance log information', 
    type: [AttendanceLogDto], 
    example: [
      { check_in_time: '', check_out_time: '', user_id: '' }
    ]
  })
  @IsOptional()
  attendance_logs?: AttendanceLogDto[];

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
