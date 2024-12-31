import { Inject, Injectable } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { ClientProxy } from "@nestjs/microservices";

// dto
import { SendEmailDto } from "./auth/dto/send-email.dto";

// constants
import { MAIL_CLIENT } from "./common/utils/constants";

// contracts
import { 
    MAIL_PATTERN, 
    WelcomeMailDto as ClientWelcomeMailDto,
    OnboardingMailDto as ClientOnboardingDto,
    ResetPasswordMailDto as ClientResetPasswordMailDto
 } from '@app/contracts'


@Injectable()
export class AlevaApiGatewayService {
    constructor(@Inject(MAIL_CLIENT) private readonly mailClient: ClientProxy) { }

    async sendOnboardingEmail(sendOnboardingMailDto: SendEmailDto): Promise<any> {
        const sendOnboardingMail = plainToInstance(ClientOnboardingDto, sendOnboardingMailDto);

        return await this.mailClient.send<any, ClientOnboardingDto>(
            MAIL_PATTERN.MAIL_ONBOARDING_SEND, sendOnboardingMail
        ).toPromise();
    }

    async sendWelcomeEmail(sendWelcomeMailDto: SendEmailDto): Promise<any> {
        const sendWelcomeMail = plainToInstance(ClientWelcomeMailDto, sendWelcomeMailDto);

        return await this.mailClient.send<any, ClientWelcomeMailDto>(
            MAIL_PATTERN.MAIL_WELCOME_SEND, sendWelcomeMail
        ).toPromise();
    }

    async sendResetPasswordEmail(sendResetPasswordMailDto: SendEmailDto): Promise<any> {
        const sendResetPasswordMail = plainToInstance(ClientResetPasswordMailDto, sendResetPasswordMailDto);

        return this.mailClient.send<any, ClientResetPasswordMailDto>(
            MAIL_PATTERN.MAIL_RESET_PASSWORD_SEND, sendResetPasswordMail
        ).toPromise();
    }

    // TODO:
    async sendVerificationEmail(sendVerificationMailDto: SendEmailDto): Promise<any> {
        const sendVerificationMail = plainToInstance(ClientOnboardingDto, sendVerificationMailDto);

        return this.mailClient.send<any, ClientOnboardingDto>(
            MAIL_PATTERN.MAIL_VERIFICATION_SEND, sendVerificationMail
        ).toPromise();
    }
}
