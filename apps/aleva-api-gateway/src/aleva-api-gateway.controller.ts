import { ApiOperation } from '@nestjs/swagger';
import { Body, Controller, Post } from '@nestjs/common';

// dto
import { SendEmailDto } from './auth/dto/send-email.dto';

// service
import { AlevaApiGatewayService } from './aleva-api-gateway.service';

@Controller()
export class AlevaApiGatewayController {
  constructor(private readonly alevaApiGatewayService: AlevaApiGatewayService) { }

  @Post("auth.onboarding")
  @ApiOperation({ summary: 'Email Test' })
  async sendOnboardingEmail(@Body() body: SendEmailDto): Promise<{}> {
    try {
      await this.alevaApiGatewayService.sendOnboardingEmail(body);

      return { "message": "Email sent successfully" };
    } catch (error) {
      throw new Error("Failed to send email");
    }
  }
  @Post("auth.welcome")
  @ApiOperation({ summary: 'Email Test' })
  async sendWelcomeEmail(@Body() body: SendEmailDto): Promise<{}> {
    try {
      await this.alevaApiGatewayService.sendWelcomeEmail(body);

      return { "message": "Password reset email sent successfully" };
    } catch (error) {
      throw new Error("Failed to send email");
    }
  }

  @Post("auth.reset-password")
  @ApiOperation({ summary: 'Email Test' })
  async sendResetPasswordEmail(@Body() body: SendEmailDto): Promise<{}> {
    try {
      await this.alevaApiGatewayService.sendResetPasswordEmail(body);

      return { "message": "Password reset email sent successfully" };
    } catch (error) {
      throw new Error("Failed to send email");
    }
  }

  @Post("auth.verify-email")
  @ApiOperation({ summary: 'Email Test' })
  async sendVerificationEmail(@Body() body: SendEmailDto): Promise<{}> {
    try {
      await this.alevaApiGatewayService.sendVerificationEmail(body);

      return { "message": "Verification email sent successfully" };
    } catch (error) {
      throw new Error("Failed to send email");
    }
  }

  // @Post("auth.qr-code")
  // @ApiOperation({ summary: 'Email Test' })
  // async sendQrCodeEmail(@Body() body: SendEmailDto): Promise<{}> {
  //   try {
  //     await this.alevaApiGatewayService.sendQrCodeEmail(body);

  //     return { "message": "QR Code email sent successfully" };
  //   } catch (error) {
  //     throw new Error("Failed to send email");
  //   }
  // }
}