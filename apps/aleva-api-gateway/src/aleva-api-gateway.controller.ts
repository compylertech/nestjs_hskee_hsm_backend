import { Body, Controller, Post } from '@nestjs/common';

// service
import { AlevaApiGatewayService } from './aleva-api-gateway.service';
import { ApiOperation } from '@nestjs/swagger';
import { SendEmailDto } from './auth/dto/send-email.dto';

@Controller()
export class AlevaApiGatewayController {
  constructor(private readonly alevaApiGatewayService: AlevaApiGatewayService) { }

  @Post("auth.verify-email")
  @ApiOperation({ summary: 'Email Test' })
  async sendEmail(@Body() body: SendEmailDto): Promise<{}> {
    const { recipient, name, email } = body;

    try {
      await this.alevaApiGatewayService.sendEmail({
        name: name,
        email: email,
      }, recipient, "Email Confirmed");

      return { "message": "Email sent successfully" };
    } catch (error) {
      throw new Error("Failed to send email");
    }
  }
}