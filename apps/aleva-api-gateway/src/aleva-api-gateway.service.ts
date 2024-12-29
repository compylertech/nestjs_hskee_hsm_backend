import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

// dto
import { SendEmailDto } from "./auth/dto/send-email.dto";

// constants
import { MAIL_CLIENT } from "./common/utils/constants";

// contracts
import { MAIL_PATTERN, MailDto as ClientOnboardingDto } from '@app/contracts'


@Injectable()
export class AlevaApiGatewayService {
    constructor(@Inject(MAIL_CLIENT) private readonly mailClient: ClientProxy) { }

    async sendEmail(sendOnboardingMailDto: SendEmailDto): Promise<any> {
        return this.mailClient.send<any, ClientOnboardingDto>(
            MAIL_PATTERN.MAIL_ONBOARDING_SEND, sendOnboardingMailDto
        ).toPromise();
    }
}
