import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

// services
import { MailService } from './mail.service';

// contracts
import { MAIL_PATTERN, OnboardingMailDto, ResetPasswordMailDto, WelcomeMailDto } from '@app/contracts';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) { }

  @MessagePattern(MAIL_PATTERN.MAIL_ONBOARDING_SEND)
  async sendOnboardingEmail(@Payload() onboardingMailDto: OnboardingMailDto) {
    try {
      return await this.mailService.sendOnboardingMail(onboardingMailDto, onboardingMailDto.user_email, "Onboarding Email");
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || 'Error sending onboarding mail!',
      });
    }
  }

  @MessagePattern(MAIL_PATTERN.MAIL_WELCOME_SEND)
  async sendWelcomeEmail(@Payload() welcomeMailDto: WelcomeMailDto) {
    try {
      return await this.mailService.sendWelcomeMail(welcomeMailDto, welcomeMailDto.user_email, "Welcome Email");
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || 'Error sending welcome mail!',
      });
    }
  }

  @MessagePattern(MAIL_PATTERN.MAIL_RESET_PASSWORD_SEND)
  async sendPasswordResetEmail(@Payload() passwordResetMailDto: ResetPasswordMailDto) {
    try {
      return await this.mailService.sendPasswordResetMail(passwordResetMailDto, passwordResetMailDto.user_email, "Password Reset Email");
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || 'Error sending password reset mail!',
      });
    }
  }

  @MessagePattern(MAIL_PATTERN.MAIL_QR_CODE_SEND)
  async sendQrCodeEmail(@Payload() qrCodeMailDto: OnboardingMailDto) {
    try {
      return await this.mailService.sendQrCodeMail(qrCodeMailDto, qrCodeMailDto.user_email, "QR Code Email");
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || 'Error sending qr code mail!',
      });
    }
  }
}
