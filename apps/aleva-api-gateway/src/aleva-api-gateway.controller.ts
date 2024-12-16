import * as path from "path";
import { Body, Controller, Post } from '@nestjs/common';

// service
import { AlevaApiGatewayService } from './aleva-api-gateway.service';

@Controller()
export class AlevaApiGatewayController {
  constructor(private readonly alevaApiGatewayService: AlevaApiGatewayService) {}

  @Post("auth.verify-email")
  async sendEmail(@Body() body: { recipient: string; name: string; email: string }): Promise<string> {
    const { recipient, name, email } = body;

    const templatePath = path.join(__dirname, "..", "templates", "confirmEmail.html");
    const variables = {
      name: name,
      email: email,
    };

    try {
      await this.alevaApiGatewayService.sendEmail(templatePath, variables, recipient, "Email Confirmed");
      return "Email sent successfully";
    } catch (error) {
      throw new Error("Failed to send email");
    }
  }
}