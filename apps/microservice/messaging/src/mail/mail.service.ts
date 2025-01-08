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
    async sendPasswordResetMail(variables: ResetPasswordMailDto): Promise<void> {
        return this.sendMail("./passwordReset.html", variables, variables.email, "Password Reset Email");
    }

    // verify email
    async sendVerificationMail(variables: ConfirmMailDto): Promise<void> {
        return this.sendMail("./confirmEmail.html", variables, variables.email, "User Verification Email");
    }

    // send QR code
    async sendQrCodeMail(variables: OnboardingMailDto, recipient: string, subject: string): Promise<void> {
        return this.sendMail("./onboardingCompleted.html", variables, recipient, subject);
    }
    
    // welcome
    async sendWelcomeMail(variables: WelcomeMailDto): Promise<void> {
        return this.sendMail("./welcome.html", variables, variables.email, "Welcome Email");
    }

    // onboarding
    async sendOnboardingMail(variables: OnboardingMailDto, recipient: string, subject: string): Promise<void> {
        return this.sendMail("./welcome.html", variables, recipient, subject);
    }
}
