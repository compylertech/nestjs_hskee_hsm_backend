import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

// services
import { MailService } from './mail.service';

// contracts
import { OnboardingMailDto, MAIL_PATTERN } from '@app/contracts';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) { }

  @MessagePattern(MAIL_PATTERN.MAIL_ONBOARDING_SEND)
  async sendOnboardingEmail(@Payload() onboardingMailDto: OnboardingMailDto) {
    try {
      return await this.mailService.sendOnboardingMail(onboardingMailDto, onboardingMailDto.email, "Onboarding Email");
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || 'Error sending onboarding mail!',
      });
    }
  }
}
