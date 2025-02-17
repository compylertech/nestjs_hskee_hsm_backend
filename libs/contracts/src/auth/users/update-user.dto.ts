
// dto
import { CreateAddressDto, CreateMediaDto, EntityQuestionnaireDto, UpdateAddressDto, UpdateAttendanceLogDto, UpdateEntityQuestionnaireDto, UpdateMediaDto } from '@app/contracts';

export class UpdateUserDto {
    user_id?: string;

    first_name?: string;
    last_name?: string;
    gender?: string;
    date_of_birth?: string; // TODO: take a look change from string to Date
    email?: string;
    phone_number?: string;
    identification_number?: string;
    photo_url?: string;

    // UserAuthInfo
    password?: string;
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

    attendance_logs?: UpdateAttendanceLogDto[];
    answers?: EntityQuestionnaireDto[] | UpdateEntityQuestionnaireDto[];

    media?: CreateMediaDto[] | UpdateMediaDto[];
    address?: CreateAddressDto[] | UpdateAddressDto[];
}