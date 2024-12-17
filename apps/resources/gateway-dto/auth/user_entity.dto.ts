import { ApiProperty } from '@nestjs/swagger';
import { AddressDto } from '../address/address.dto';
import { RoleDto } from './role.dto';
import { MediaDto } from '../resources/media.dto';
import { AttendanceLogDto } from './attendance-log.dto';
import { AccountDto } from '../billing/account.dto';
import { QuestionnaireDto } from '../forms/questionnaire.dto';

export class UserDto {
  @ApiProperty({ description: 'User ID', example: '5c3e3e10-0467-4466-86db-412987e75b0e' })
  user_id: string;

  @ApiProperty({ description: 'First name of the user', example: 'Daniel' })
  first_name: string;

  @ApiProperty({ description: 'Last name of the user', example: 'Quaidoo' })
  last_name: string;

  @ApiProperty({ description: 'Gender of the user', example: 'male' })
  gender: string;

  @ApiProperty({ description: 'Date of birth', example: '2024-11-26' })
  date_of_birth: string;

  @ApiProperty({ description: 'Email address of the user', example: 'daniel.quaido1@gmail.com' })
  email: string;

  @ApiProperty({ description: 'Phone number of the user', example: '2330596201499' })
  phone_number: string;

  @ApiProperty({ description: 'Identification number of the user', example: 'GHA-123456789-0' })
  identification_number: string;

  @ApiProperty({ description: 'URL of the user photo', example: 'https://example.com/photo.jpg', nullable: true })
  photo_url?: string;

  @ApiProperty({ description: 'Login provider', example: 'native' })
  login_provider: string;

  @ApiProperty({ description: 'Verification token', example: 'a9534ee0-b83b-445c-bee2-8fa2eb8585bb', nullable: true })
  verification_token?: string;

  @ApiProperty({ description: 'Is subscribed token', example: 'ee029f92-4ba3-4144-9827-d49a8d3d450e', nullable: true })
  is_subscribed_token?: string;

  @ApiProperty({ description: 'Whether the user is disabled', example: false })
  is_disabled: boolean;

  @ApiProperty({ description: 'Whether the user is verified', example: true })
  is_verified: boolean;

  @ApiProperty({ description: 'Whether the user is subscribed', example: true })
  is_subscribed: boolean;

  @ApiProperty({ description: 'Whether the user is onboarded', example: true })
  is_onboarded: boolean;

  @ApiProperty({ description: 'Whether the user is approved', example: false })
  is_approved: boolean;

  @ApiProperty({ description: 'Whether the user is rejected', example: true })
  is_rejected: boolean;

  @ApiProperty({ description: 'Last login time', example: '2024-12-01T22:01:00Z', nullable: true })
  last_login_time?: Date;

  @ApiProperty({ description: 'Current login time', example: '2024-11-26T14:04:41.300443Z', nullable: true })
  current_login_time?: Date;

  @ApiProperty({ description: 'Emergency contact name', example: 'Bobbie Brown', nullable: true })
  emergency_contact_name?: string;

  @ApiProperty({ description: 'Emergency contact email', example: 'bbrown@gmail.com', nullable: true })
  emergency_contact_email?: string;

  @ApiProperty({ description: 'Emergency contact relation', example: 'Close friend', nullable: true })
  emergency_contact_relation?: string;

  @ApiProperty({ description: 'Emergency contact number', example: '233245667788', nullable: true })
  emergency_contact_number?: string;

  @ApiProperty({ description: 'User addresses', type: [AddressDto] })
  address: AddressDto[];

  @ApiProperty({ description: 'User roles', type: [RoleDto] })
  roles: RoleDto[];

  @ApiProperty({ description: 'User media', type: [MediaDto] })
  media: MediaDto[];

  @ApiProperty({ description: 'User attendance logs', type: [AttendanceLogDto] })
  attendance_logs: AttendanceLogDto[];

  @ApiProperty({ description: 'User accounts', type: [AccountDto] })
  accounts: AccountDto[];

  @ApiProperty({ description: 'User questionnaires', type: [QuestionnaireDto] })
  questionnaires: QuestionnaireDto[];
}
