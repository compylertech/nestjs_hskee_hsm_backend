import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Controller, Post, Body, Get, Query } from '@nestjs/common';

// decorators
import { Public } from 'apps/common/decorators/public.decorator';

// dto
import { AuthSignInDto, ChangePasswordDto, MailActionDto, ResetPasswordDto, VerifyEmailDto } from './dto/auth.dto';

// services
import { AuthService } from './auth.service';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  @Post('/')
  @ApiOperation({ summary: 'User Login' })
  @ApiResponse({ status: 200, description: 'Logged in user successfully.' })
  @ApiResponse({ status: 400, description: 'Failed to log in user.' })
  userLogin(@Body() authSignInDto: AuthSignInDto) {
    return this.authService.userLogin(authSignInDto);
  }

  @Post('/reset-password')
  @ApiOperation({ summary: 'Reset Password' })
  @ApiResponse({ status: 200, description: 'Password reset successfully.' })
  @ApiResponse({ status: 400, description: 'Failed to reset password.' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.resetPassword(resetPasswordDto);
  }


  @Post('/change-password')
  @ApiOperation({ summary: 'Change Password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully.' })
  @ApiResponse({ status: 400, description: 'Failed to change password.' })
  changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(changePasswordDto);
  }

  @Get('/verify-email')
  @ApiOperation({ summary: 'Verify Email' })
  @ApiResponse({ status: 200, description: 'Email verified successfully.' })
  @ApiResponse({ status: 400, description: 'Failed to verify email.' })
  verifyEmail(@Query() query: VerifyEmailDto) {
    return this.authService.verifyEmail(query);
  }

  @Get('/mail-unsubscribe')
  @ApiOperation({ summary: 'Mail Unsubscribe' })
  @ApiResponse({ status: 200, description: 'Successfully unsubscribed from emails.', type: MailActionDto})
  @ApiResponse({status: 422, description: 'Validation Error'})
  mailUnsubscribe(@Query() query: MailActionDto) {
    return this.authService.unsubscribeEmail(query);
  }

  @Get('/mail-subscribe')
  @ApiOperation({ summary: 'Mail Subscribe' })
  @ApiResponse({ status: 200, description: 'Successfully subscribed to emails.' })
  @ApiResponse({ status: 400, description: 'Failed to subscribe to emails.' })
  mailSubscribe(@Query() query: MailActionDto) {
    return this.authService.subscribeEmail(query);
  }
}
