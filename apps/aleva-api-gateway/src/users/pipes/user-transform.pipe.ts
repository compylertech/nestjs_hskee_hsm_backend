import { map } from 'rxjs';
import { plainToInstance } from 'class-transformer';

// entity
import { User } from '../../../../auth/src/users/entities/user.entity';

// dto
import { UserAuthInfoDto, UserEmergencyInfoDto } from '../dto/user-utils.dto';
import { CreateUserDto as GatewayCreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto as GatewayUpdateUserDto } from '../dto/update-user.dto';

// contracts
import { UserDto, CreateUserDto as MicroserviceCreateUserDto } from '@app/contracts';


export function transformUserToDto(user: User): UserDto|{} {
    if (!user && typeof user !== 'object') {
        throw new Error('User entity is required for transformation.');
    }

    // check if the object returned an error
    if (typeof user === 'object' && 'error' in user && user.error !== "") {
        return user;
    }

    const {
        login_provider,
        verification_token,
        is_subscribed_token,
        is_disabled,
        is_verified,
        is_subscribed,
        is_onboarded,
        is_approved,
        is_rejected,
        password,
        last_login_time,
        current_login_time,
        emergency_contact_name,
        emergency_contact_email,
        emergency_contact_relation,
        emergency_contact_number,
        ...baseUser
    } = user;

    return plainToInstance(UserDto, {
        ...baseUser,
        user_auth_info: {
            login_provider,
            verification_token,
            is_subscribed_token,
            is_disabled,
            is_verified,
            is_subscribed,
            is_onboarded,
            is_approved,
            is_rejected,
            last_login_time,
            current_login_time,
        } as UserAuthInfoDto,
        user_emergency_info: {
            emergency_contact_name,
            emergency_contact_email,
            emergency_contact_relation,
            emergency_contact_number,
        } as UserEmergencyInfoDto,
    });
}

export function transformGatewayUserDto(dto: GatewayCreateUserDto | GatewayUpdateUserDto): MicroserviceCreateUserDto {
    return {
        // direct mappings
        first_name: dto.first_name,
        last_name: dto.last_name,
        gender: dto.gender,
        email: dto.email,
        date_of_birth: dto.date_of_birth,
        phone_number: dto.phone_number,
        identification_number: dto.identification_number,
        photo_url: dto.photo_url,

        // flatten user_auth_info
        login_provider: dto.user_auth_info?.login_provider,
        verification_token: dto.user_auth_info?.verification_token,
        reset_token: dto.user_auth_info?.reset_token,
        is_subscribed_token: dto.user_auth_info?.is_subscribed_token,
        is_disabled: dto.user_auth_info?.is_disabled,
        is_verified: dto.user_auth_info?.is_verified,
        is_subscribed: dto.user_auth_info?.is_subscribed,
        is_onboarded: dto.user_auth_info?.is_onboarded,
        is_approved: dto.user_auth_info?.is_approved,
        is_rejected: dto.user_auth_info?.is_rejected,
        last_login_time: dto.user_auth_info?.last_login_time,
        current_login_time: dto.user_auth_info?.current_login_time,

        // flatten user_emergency_info
        emergency_contact_name: dto.user_emergency_info?.emergency_contact_name,
        emergency_contact_email: dto.user_emergency_info?.emergency_contact_email,
        emergency_contact_relation: dto.user_emergency_info?.emergency_contact_relation,
        emergency_contact_number: dto.user_emergency_info?.emergency_contact_number,

        // add password if it exists
        ...(dto.password ? { password: dto.password } : {})
    };
}

export const transformUserPipe = map((user: User) => transformUserToDto(user));