import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

// dto
import { SendEmailDto } from "./auth/dto/send-email.dto";

// constants
import { MAIL_CLIENT } from "./common/utils/constants";

// contracts
import { MAIL_PATTERN, OnboardingMailDto as ClientOnboardingDto } from '@app/contracts'


@Injectable()
export class AlevaApiGatewayService {
    constructor(@Inject(MAIL_CLIENT) private readonly mailClient: ClientProxy) { }

    async sendEmail(sendOnboardingMailDto: SendEmailDto): Promise<any> {
        return this.mailClient.send<any, ClientOnboardingDto>(
            MAIL_PATTERN.MAIL_ONBOARDING_SEND, sendOnboardingMailDto
        ).toPromise();
    }

    // async sendEmail(variables: Record<string, string>, recipient: string, subject: string): Promise<void> {
    //     try {
    //         await this.mailerService.sendMail({
    //             to: recipient,
    //             subject: subject,
    //             template: './confirmEmail.html',
    //             context: variables
    //         })
    //     } catch (error) {
    //         throw new Error(`Failed to send email ${error.message}`);
    //     }
    // }
}
