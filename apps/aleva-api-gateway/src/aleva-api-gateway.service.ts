import * as fs from "fs/promises";
import * as Handlebars from "handlebars";
import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";


@Injectable()
export class AlevaApiGatewayService {
    constructor(private readonly mailerService: MailerService) {}

    async sendEmail(templatePath: string, variables: Record<string, string>, recipient: string, subject: string): Promise<void> {
        try {
            const templateContent = await fs.readFile(templatePath, "utf8");

            const template = Handlebars.compile(templateContent);
            const htmlContent = template(variables);

            await this.mailerService.sendMail({
                to: recipient,
                subject: subject,
                html: htmlContent,
            })
        } catch (error) {
            throw new Error("Failed to send email");
        }
    }
}
