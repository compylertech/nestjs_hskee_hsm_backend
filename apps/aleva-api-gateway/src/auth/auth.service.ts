import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

// constants
import { AUTH_CLIENT } from '../common/utils/constants';

// api-gateway dtos
import {
  AuthSignInDto,
  ResetPasswordDto,
  VerifyEmailDto,
  MailActionDto,
} from './dto/auth.dto';

// contracts
import {
  AUTH_PATTERN,
  AuthDto as ClientAuthDto,
  AuthSignInDto as ClientAuthSignInDto,
  ResetPasswordDto as ClientResetPasswordDto,
  VerifyEmailDto as ClientVerifyEmailDto,
  MailActionDto as ClientMailActionDto,
} from '@app/contracts';


@Injectable()
export class AuthService {
  constructor(@Inject(AUTH_CLIENT) private authClient: ClientProxy) { }

  userLogin(authSignInDto: AuthSignInDto) {
    try {
      return this.authClient.send<ClientAuthSignInDto, ClientAuthDto>(
        AUTH_PATTERN.USER_LOGIN,
        authSignInDto
      );
    } catch (error) {
      throw error
    }
  }

  resetPassword(resetPasswordDto: ResetPasswordDto) {
    try {
      return this.authClient.send<{}, ClientResetPasswordDto>(
        AUTH_PATTERN.RESET_PASSWORD,
        resetPasswordDto,
      );
    } catch (error) {
      throw error;
    }
  }

  verifyEmail(verifyEmailDto: VerifyEmailDto) {
    try {
      return this.authClient.send<{}, ClientVerifyEmailDto>(
        AUTH_PATTERN.VERIFY_EMAIL,
        verifyEmailDto,
      );
    } catch (error) {
      throw error;
    }
  }

  unsubscribeEmail(mailActionDto: MailActionDto) {
    try {
      return this.authClient.send<{}, ClientMailActionDto>(
        AUTH_PATTERN.MAIL_UNSUBSCRIBE,
        mailActionDto,
      );
    } catch (error) {
      throw error;
    }
  }

  subscribeEmail(mailActionDto: MailActionDto) {
    try {
      return this.authClient.send<{}, ClientMailActionDto>(
        AUTH_PATTERN.MAIL_SUBSCRIBE,
        mailActionDto,
      );
    } catch (error) {
      throw error;
    }
  }
}
