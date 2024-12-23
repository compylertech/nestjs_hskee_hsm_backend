import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

// contracts
import { OnboardingMailDto } from '@app/contracts';


@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) { }

  // methods for 
  // forgot mail password
  // verify email
  // send QR code
  // welcome

  // onboarding
  async sendOnboardingMail(variables: OnboardingMailDto, recipient: string, subject: string): Promise<void> {
    try {
        await this.mailerService.sendMail({
            to: recipient,
            subject: subject,
            template: './confirmEmail.html',
            context: variables
        })
    } catch (error) {
        throw new Error(`Failed to send email ${error.message}`);
    }
}
}
