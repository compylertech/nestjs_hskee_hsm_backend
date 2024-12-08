import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDate, IsBoolean, IsOptional } from 'class-validator';

// address
import { AddressDto } from './address.dto';

export class UserAuthInfoDto {
  @ApiProperty({ description: 'Login provider', example: 'native' })
  @IsString()
  login_provider: string;

  @ApiProperty({ description: 'Verification token', example: 'a9534ee0-b83b-445c-bee2-8fa2eb8585bb', nullable: true })
  @IsString()
  @IsOptional()
  verification_token?: string;

  @ApiProperty({ description: 'Is subscribed token', example: 'ee029f92-4ba3-4144-9827-d49a8d3d450e', nullable: true })
  @IsString()
  @IsOptional()
  is_subscribed_token?: string;

  @ApiProperty({ description: 'Whether the user is disabled', example: false })
  @IsBoolean()
  is_disabled: boolean;

  @ApiProperty({ description: 'Whether the user is verified', example: true })
  @IsBoolean()
  is_verified: boolean;

  @ApiProperty({ description: 'Whether the user is subscribed', example: true })
  @IsBoolean()
  is_subscribed: boolean;

  @ApiProperty({ description: 'Whether the user is onboarded', example: true })
  @IsBoolean()
  is_onboarded: boolean;

  @ApiProperty({ description: 'Whether the user is approved', example: false })
  @IsBoolean()
  is_approved: boolean;

  @ApiProperty({ description: 'Whether the user is rejected', example: true })
  @IsBoolean()
  is_rejected: boolean;

  @ApiProperty({ description: 'Last login time', example: '2024-12-01T22:01:00Z', nullable: true })
  @IsOptional()
  @Type(() => Date)
  last_login_time?: Date;

  @ApiProperty({ description: 'Current login time', example: '2024-11-26T14:04:41.300443Z', nullable: true })
  @IsOptional()
  @Type(() => Date)
  current_login_time?: Date;
}

export class UserEmergencyInfoDto {
  @ApiProperty({ description: 'Emergency contact name', example: 'Bobbie Brown', nullable: true })
  @IsString()
  @IsOptional()
  emergency_contact_name?: string;

  @ApiProperty({ description: 'Emergency contact email', example: 'bbrown@gmail.com', nullable: true })
  @IsString()
  @IsOptional()
  emergency_contact_email?: string;

  @ApiProperty({ description: 'Emergency contact relation', example: 'Close friend', nullable: true })
  @IsString()
  @IsOptional()
  emergency_contact_relation?: string;

  @ApiProperty({ description: 'Emergency contact number', example: '233245667788', nullable: true })
  @IsString()
  @IsOptional()
  emergency_contact_number?: string;

  @ApiProperty({ description: 'Emergency contact address', type: [AddressDto] })
  @Type(() => AddressDto)
  address: AddressDto[];
}

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

  @ApiProperty({ description: 'Email address of the user', example: 'john.doe@compyler.io' })
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
  user_auth_info: UserAuthInfoDto;

  @ApiProperty({ description: 'User emergency contact information', type: UserEmergencyInfoDto })
  @Type(() => UserEmergencyInfoDto)
  user_emergency_info: UserEmergencyInfoDto;
}
