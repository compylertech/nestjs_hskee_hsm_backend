import { JwtService } from '@nestjs/jwt';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';

// services
import { UsersService } from '../users/users.service';

// contracts
import {
    AuthDto,
    AuthSignInDto,
    AuthResultDto,
    ResetPasswordDto,
    VerifyEmailDto,
    MailActionDto
} from '@app/contracts';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async authenticate(input: AuthDto): Promise<AuthResultDto> {
        const user = await this.validateUser(input);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return this.signIn(user)
    }

    async validateUser(input: AuthDto): Promise<AuthSignInDto | null> {
        const user = await this.usersService.findUserByEmail(input.email)

        if (user && user.password === input.password) {
            return {
                userId: user.user_id,
                email: user.email
            }
        }

        return null
    }

    async signIn(user: AuthSignInDto): Promise<AuthResultDto> {
        const tokenPayload = {
            sub: user.userId,
            username: user.email
        }

        const accessToken = await this.jwtService.signAsync(tokenPayload);

        return { accessToken, email: user.email, userId: user.userId }
    }

    async resetPassword(input: ResetPasswordDto): Promise<{ message: string }> {
        const user = await this.usersService.findUserByEmail(input.email);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const isValidToken = await this.usersService.validateResetToken(
            input.email,
            input.token,
        );
        if (!isValidToken) {
            throw new UnauthorizedException('Invalid reset token');
        }

        await this.usersService.updatePassword(user.user_id, input.newPassword);
        return { message: 'Password reset successfully' };
    }

    // Handles email verification
    async verifyEmail(token: string): Promise<{ message: string }> {
        const isValidToken = await this.usersService.verifyEmailToken(token);
        if (!isValidToken) {
            throw new UnauthorizedException('Invalid or expired token');
        }

        await this.usersService.markEmailAsVerified(token);
        return { message: 'Email verified successfully' };
    }

    // Handles email unsubscription
    async unsubscribeEmail(input: MailActionDto): Promise<{ message: string }> {
        const user = await this.usersService.findUserByEmail(input.email);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        if (user.is_subscribed_token == input.token) {
            await this.usersService.unsubscribeFromEmails(user.user_id);
            return { message: 'Successfully unsubscribed from emails' };
        }

        throw new BadRequestException('Error unsubscribing email!');
    }

    // Handles email subscription
    async subscribeEmail(input: MailActionDto): Promise<{ message: string }> {
        const user = await this.usersService.findUserByEmail(input.email);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        if (user.is_subscribed_token == input.token) {
            await this.usersService.subscribeToEmails(user.user_id);
            return { message: 'Successfully subscribed to emails' };
        }

        throw new BadRequestException('Error subscribing email!');
    }
}