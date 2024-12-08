import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthSignInDto {
    @ApiProperty({ description: 'The email of the user' })
    @IsString()
    @IsNotEmpty()
    email!: string;

    @ApiProperty({ description: 'The password of the user' })
    @IsString()
    @IsNotEmpty()
    password!: string;
}


export class ResetPasswordDto {
    @ApiProperty({ description: 'The email of the user' })
    @IsString()
    @IsNotEmpty()
    email!: string;

    @ApiProperty({ description: 'The reset token sent to the user' })
    @IsString()
    @IsNotEmpty()
    token!: string;

    @ApiProperty({ description: 'The new password for the user' })
    @IsString()
    @IsNotEmpty()
    newPassword!: string;
}

export class VerifyEmailDto {
    @ApiProperty({ description: 'The email of the user' })
    @IsString()
    @IsNotEmpty()
    email!: string;

    @ApiProperty({ description: 'The email verification token' })
    @IsString()
    @IsNotEmpty()
    token!: string;
}

export class MailActionDto {
    @ApiProperty({ description: 'The email of the user',  example: 'johndoe@compyler.io'})
    @IsString()
    @IsNotEmpty()
    email!: string;

    @ApiProperty({ description: 'The email verification token', example: 'a9534ee0-b83b-445c-bee2-8fa2eb8585bb' })
    @IsString()
    @IsNotEmpty()
    token!: string;
}