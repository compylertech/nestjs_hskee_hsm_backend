import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

// services
import { AuthService } from './auth.service';

// contracts
import {
    AUTH_PATTERN,
    AuthDto,
    ResetPasswordDto,
    VerifyEmailDto,
    MailActionDto,
} from '@app/contracts';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @MessagePattern(AUTH_PATTERN.USER_LOGIN)
    async login(@Payload() input: AuthDto) {
        try {
            return await this.authService.authenticate(input);
        } catch (error) {
            throw new RpcException({
                statusCode: 401,
                message: error.message || 'Unauthorized',
            });
        }
    }

    @MessagePattern(AUTH_PATTERN.RESET_PASSWORD)
    async resetPassword(@Payload() input: ResetPasswordDto) {
        try {
            return await this.authService.resetPassword(input);
        } catch (error) {
            throw new RpcException({
                statusCode: 400,
                message: error.message || 'Password reset failed',
            });
        }
    }

    @MessagePattern(AUTH_PATTERN.VERIFY_EMAIL)
    async verifyEmail(@Payload() input: VerifyEmailDto) {
        try {
            return await this.authService.verifyEmail(input.token);
        } catch (error) {
            throw new RpcException({
                statusCode: 400,
                message: error.message || 'Email verification failed',
            });
        }
    }

    @MessagePattern(AUTH_PATTERN.MAIL_UNSUBSCRIBE)
    async unsubscribeEmail(@Payload() input: MailActionDto) {
        try {
            return await this.authService.unsubscribeEmail(input);
        } catch (error) {
            throw new RpcException({
                statusCode: 400,
                message: error.message || 'Email unsubscription failed',
            });
        }
    }

    @MessagePattern(AUTH_PATTERN.MAIL_SUBSCRIBE)
    async subscribeEmail(@Payload() input: MailActionDto) {
        try {
            return await this.authService.subscribeEmail(input);
        } catch (error) {
            throw new RpcException({
                statusCode: 400,
                message: error.message || 'Email subscription failed',
            });
        }
    }

}
