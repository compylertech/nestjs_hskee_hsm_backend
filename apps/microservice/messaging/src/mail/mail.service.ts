import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";

// contracts
import { MailDto } from "@app/contracts";


@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) { }

    private async sendMail(template: string, variables: MailDto, recipient: string, subject: string): Promise<void> {
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
    async sendPasswordResetMail(variables: MailDto, recipient: string, subject: string): Promise<void> {
        return this.sendMail("./passwordReset.html", variables, recipient, subject);
    }

    // verify email
    async sendVerificationMail(variables: MailDto, recipient: string, subject: string): Promise<void> {
        return this.sendMail("./confirmEmail.html", variables, recipient, subject);
    }

    // send QR code
    async sendQrCodeMail(variables: MailDto, recipient: string, subject: string): Promise<void> {
        return this.sendMail("", variables, recipient, subject);
    }
    
    // welcome
    async sendWelcomeMail(variables: MailDto, recipient: string, subject: string): Promise<void> {
        return this.sendMail("./welcome.html", variables, recipient, subject);
    }

    // onboarding
    async sendOnboardingMail(variables: MailDto, recipient: string, subject: string): Promise<void> {
        return this.sendMail("./onboarding.html", variables, recipient, subject);
    }
}
