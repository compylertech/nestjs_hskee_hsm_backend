import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

// services
import { MailService } from './mail.service';

// contracts
import { MailDto, MAIL_PATTERN } from '@app/contracts';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) { }

  @MessagePattern(MAIL_PATTERN.MAIL_ONBOARDING_SEND)
  async sendOnboardingEmail(@Payload() onboardingMailDto: MailDto) {
    try {
      return await this.mailService.sendOnboardingMail(onboardingMailDto, onboardingMailDto.email, "Onboarding Email");
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || 'Error sending onboarding mail!',
      });
    }
  }

  @MessagePattern(MAIL_PATTERN.MAIL_WELCOME_SEND)
  async sendWelcomeEmail(@Payload() welcomeMailDto: MailDto) {
    try {
      return await this.mailService.sendWelcomeMail(welcomeMailDto, welcomeMailDto.email, "Welcome Email");
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || 'Error sending welcome mail!',
      });
    }
  }

  @MessagePattern(MAIL_PATTERN.MAIL_RESET_PASSWORD_SEND)
  async sendPasswordResetEmail(@Payload() passwordResetMailDto: MailDto) {
    try {
      return await this.mailService.sendPasswordResetMail(passwordResetMailDto, passwordResetMailDto.email, "Password Reset Email");
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || 'Error sending password reset mail!',
      });
    }
  }

  @MessagePattern(MAIL_PATTERN.MAIL_QR_CODE_SEND)
  async sendQrCodeEmail(@Payload() qrCodeMailDto: MailDto) {
    try {
      return await this.mailService.sendQrCodeMail(qrCodeMailDto, qrCodeMailDto.email, "QR Code Email");
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || 'Error sending qr code mail!',
      });
    }
  }
}
