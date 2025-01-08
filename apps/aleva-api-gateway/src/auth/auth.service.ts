import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

// constants
import { AUTH_CLIENT, MAIL_CLIENT } from '../common/utils/constants';

// api-gateway dtos
import {
  AuthSignInDto,
  ResetPasswordDto,
  VerifyEmailDto,
  MailActionDto,
  ChangePasswordDto,
} from './dto/auth.dto';

// contracts
import {
  AUTH_PATTERN,
  AuthDto as ClientAuthDto,
  AuthSignInDto as ClientAuthSignInDto,
  ResetPasswordDto as ClientResetPasswordDto,
  ChangePasswordDto as ClientChangePasswordDto,
  VerifyEmailDto as ClientVerifyEmailDto,
  MailActionDto as ClientMailActionDto,

  MAIL_PATTERN,
  ResetPasswordMailDto
} from '@app/contracts';


@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_CLIENT) private authClient: ClientProxy,
    @Inject(MAIL_CLIENT) private mailClient: ClientProxy
  ) { }

  async userLogin(authSignInDto: AuthSignInDto) {
    try {
      return await this.authClient.send<ClientAuthSignInDto, ClientAuthDto>(
        AUTH_PATTERN.USER_LOGIN,
        authSignInDto
      );
    } catch (error) {
      throw error
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    try {
      const response = await this.authClient.send<{}, ClientResetPasswordDto>(
        AUTH_PATTERN.RESET_PASSWORD,
        resetPasswordDto,
      );

      return response;
    } catch (error) {
      throw error;
    }
  }

  async changePassword(changePasswordDto: ChangePasswordDto) {
    try {
      return await this.authClient.send<{}, ClientChangePasswordDto>(
        AUTH_PATTERN.CHANGE_PASSWORD,
        changePasswordDto,
      );
    } catch (error) {
      throw error;
    }
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    try {
      return await this.authClient.send<{}, ClientVerifyEmailDto>(
        AUTH_PATTERN.VERIFY_EMAIL,
        verifyEmailDto,
      ).toPromise();
    } catch (error) {
      throw error;
    }
  }

  async unsubscribeEmail(mailActionDto: MailActionDto) {
    try {
      return await this.authClient.send<{}, ClientMailActionDto>(
        AUTH_PATTERN.MAIL_UNSUBSCRIBE,
        mailActionDto,
      );
    } catch (error) {
      throw error;
    }
  }

  async subscribeEmail(mailActionDto: MailActionDto) {
    try {
      return await this.authClient.send<{}, ClientMailActionDto>(
        AUTH_PATTERN.MAIL_SUBSCRIBE,
        mailActionDto,
      );
    } catch (error) {
      throw error;
    }
  }
}
