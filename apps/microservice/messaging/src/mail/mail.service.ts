import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";

// contracts
import { ConfirmMailDto, OnboardingMailDto, ResetPasswordMailDto, WelcomeMailDto } from "@app/contracts";


@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) { }

    private async sendMail(template: string, variables: any, recipient: string, subject: string): Promise<void> {
        try {
            await this.mailerService.sendMail({
                to: recipient,
                subject: subject,
                template: template,
                context: variables
            });
        } catch (error) {
            throw new Error(`Failed to send email ${error.message}`);
        }
    }

    // forgot password
    async sendPasswordResetMail(variables: ResetPasswordMailDto, recipient: string, subject: string): Promise<void> {
        return this.sendMail("./passwordReset.html", variables, recipient, subject);
    }

    // verify email
    async sendVerificationMail(variables: ConfirmMailDto, recipient: string, subject: string): Promise<void> {
        return this.sendMail("./confirmEmail.html", variables, recipient, subject);
    }

    // send QR code
    async sendQrCodeMail(variables: OnboardingMailDto, recipient: string, subject: string): Promise<void> {
        return this.sendMail("", variables, recipient, subject);
    }
    
    // welcome
    async sendWelcomeMail(variables: WelcomeMailDto, recipient: string, subject: string): Promise<void> {
        return this.sendMail("./welcome.html", variables, recipient, subject);
    }

    // onboarding
    async sendOnboardingMail(variables: OnboardingMailDto, recipient: string, subject: string): Promise<void> {
        return this.sendMail("./onboarding.html", variables, recipient, subject);
    }
}
