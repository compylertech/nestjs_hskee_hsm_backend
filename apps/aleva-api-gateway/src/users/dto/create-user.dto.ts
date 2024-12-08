import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsDate, IsEmail, IsOptional, IsString } from 'class-validator';

// dtos
import { UserAuthInfoDto, UserEmergencyInfoDto } from './user-utils.dto';

export class CreateUserDto {
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
  @IsDate()
  @Transform(({ value }) => new Date(value)) 
  date_of_birth: Date;

  @ApiProperty({ description: 'Email address of the user', example: 'johndoe@compyler.io' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Phone number of the user', example: '233123456789' })
  @IsString()
  phone_number: string;
  
  @ApiProperty({ description: 'Identification number of the user', example: 'GHA-123456789-0' })
  @IsString()
  identification_number: string;

  @ApiProperty({ description: 'URL of the user photo', example: '', nullable: true })
  @IsOptional()
  @IsString()
  photo_url?: string;

  @ApiProperty({ description: 'User password', example: '$trongP@ssword' })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({ description: 'User authentication information', type: UserAuthInfoDto })
  @IsOptional()
  @Type(() => UserAuthInfoDto)
  user_auth_info?: UserAuthInfoDto;

  @ApiProperty({ description: 'User emergency contact information', type: UserEmergencyInfoDto })
  @IsOptional()
  @Type(() => UserEmergencyInfoDto)
  user_emergency_info?: UserEmergencyInfoDto;
}
