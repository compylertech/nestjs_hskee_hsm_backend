import { AttendanceLogDto, EntityQuestionnaireDto, UpdateEntityQuestionnaireDto } from "@app/contracts";
export class UserBaseDto {
  user_id: string;
  first_name: string;
  last_name: string;
  gender: string;
  date_of_birth: string;
  email: string;
  password: string;
  phone_number: string;
  identification_number: string;
  photo_url?: string;
}

export class UserDto {
  user_id: string;
  first_name: string;
  last_name: string;
  gender: string;
  date_of_birth: string;
  email: string;
  password: string;
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
}