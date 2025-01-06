import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional } from 'class-validator';

// dto
import { AddressDto } from './address.dto';

export class UserAuthInfoDto {
    @ApiProperty({ description: 'Login provider', example: 'native' })
    @IsString()
    login_provider?: string;

    @ApiProperty({ description: 'Reset token', example: 'a9534ee0-b83b-445c-bee2-8fa2eb8585bb', nullable: true })
    @IsString()
    @IsOptional()
    reset_token?: string;

    @ApiProperty({ description: 'Verification token', example: 'a9534ee0-b83b-445c-bee2-8fa2eb8585bb', nullable: true })
    @IsString()
    @IsOptional()
    verification_token?: string;

    @ApiProperty({ description: 'Is subscribed token', example: 'ee029f92-4ba3-4144-9827-d49a8d3d450e', nullable: true })
    @IsString()
    @IsOptional()
    is_subscribed_token?: string;

    @ApiProperty({ description: 'Password', example: '', nullable: true })
    @IsString()
    @IsOptional()
    password?: string;

    @ApiProperty({ description: 'Whether the user is disabled', example: false })
    @IsBoolean()
    is_disabled?: boolean;

    @ApiProperty({ description: 'Whether the user is verified', example: true })
    @IsBoolean()
    is_verified?: boolean;

    @ApiProperty({ description: 'Whether the user is subscribed', example: true })
    @IsBoolean()
    is_subscribed?: boolean;

    @ApiProperty({ description: 'Whether the user is onboarded', example: true })
    @IsBoolean()
    is_onboarded?: boolean;

    @ApiProperty({ description: 'Whether the user is approved', example: false })
    @IsBoolean()
    is_approved?: boolean;

    @ApiProperty({ description: 'Whether the user is rejected', example: true })
    @IsBoolean()
    is_rejected?: boolean;

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
    address?: AddressDto[];
}