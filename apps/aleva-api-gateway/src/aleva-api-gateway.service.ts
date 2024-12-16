import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";


@Injectable()
export class AlevaApiGatewayService {
    constructor(private readonly mailerService: MailerService) { }

    async sendEmail(variables: Record<string, string>, recipient: string, subject: string): Promise<void> {
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
