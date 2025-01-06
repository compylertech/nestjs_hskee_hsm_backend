import { AddressDto, AttendanceLogDto, EntityQuestionnaireDto, MediaDto, UpdateEntityQuestionnaireDto } from "@app/contracts";
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserBaseDto {
  @Expose()
  user_id: string;

  @Expose()
  first_name: string;

  @Expose()
  last_name: string;

  @Expose()
  gender: string;

  @Expose()
  date_of_birth: string;

  @Expose()
  email: string;

  @Expose()
  phone_number: string;

  @Expose()
  identification_number: string;

  @Expose()
  photo_url?: string;

  @Expose()
  login_provider?: string;

  @Expose()
  verification_token?: string;

  @Expose()
  reset_token?: string;

  @Expose()
  is_subscribed_token?: string;

  @Expose()
  is_disabled?: boolean;

  @Expose()
  is_verified?: boolean;

  @Expose()
  is_subscribed?: boolean;

  @Expose()
  is_onboarded?: boolean;

  @Expose()
  is_approved?: boolean;

  @Expose()
  is_rejected?: boolean;

  @Expose()
  last_login_time?: Date;

  @Expose()
  current_login_time?: Date;
}


export class UserDto {
  user_id: string;
  first_name: string;
  last_name: string;
  gender: string;
  date_of_birth: string;
  email: string;
  password?: string;
  phone_number: string;
  identification_number: string;
  photo_url?: string;

  // UserAuthInfo
  login_provider?: string;
  verification_token?: string;
  reset_token?: string;
  is_subscribed_token?: string;
  is_disabled?: boolean;
  is_verified?: boolean;
  is_subscribed?: boolean;
  is_onboarded?: boolean;
  is_approved?: boolean;
  is_rejected?: boolean;
  last_login_time?: Date;
  current_login_time?: Date;

  // UserEmergencyInfo
  emergency_contact_name?: string;
  emergency_contact_email?: string;
  emergency_contact_relation?: string;
  emergency_contact_number?: string;
  created_at?: string;
  updated_at?: string;

  attendance_logs?: AttendanceLogDto[];
  answers?: UpdateEntityQuestionnaireDto[] | EntityQuestionnaireDto[] | EntityQuestionnaireDto; // TODO: Resolve this

  media?: MediaDto[];
  address?: AddressDto[];
}