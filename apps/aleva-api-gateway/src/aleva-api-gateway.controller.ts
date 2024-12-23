import { Body, Controller, Post } from '@nestjs/common';

// service
import { ApiOperation } from '@nestjs/swagger';
import { SendEmailDto } from './auth/dto/send-email.dto';
import { AlevaApiGatewayService } from './aleva-api-gateway.service';

@Controller()
export class AlevaApiGatewayController {
  constructor(private readonly alevaApiGatewayService: AlevaApiGatewayService) { }

  @Post("auth.verify-email")
  @ApiOperation({ summary: 'Email Test' })
  async sendEmail(@Body() body: SendEmailDto): Promise<{}> {
    try {
      await this.alevaApiGatewayService.sendEmail(body);

      return { "message": "Email sent successfully" };
    } catch (error) {
      throw new Error("Failed to send email");
    }
  }
}