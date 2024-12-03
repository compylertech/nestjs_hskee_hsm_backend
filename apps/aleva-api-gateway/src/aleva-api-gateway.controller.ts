import { Controller, Request, Get, HttpCode, HttpStatus, Post, UseGuards, Body } from '@nestjs/common';

// service
import { AuthService } from '../../auth/src/core/auth.service';
import { AlevaApiGatewayService } from './aleva-api-gateway.service';

// guards
import { PassportLocalGuard } from '../../auth/src/core/guards/passport-local.guard';
import { PassportJwtAuthGuard } from '../../auth/src/core/guards/passport-jwt.guard';

class AuthInput {
  username: string;
  password: string;
}


@Controller()
export class AlevaApiGatewayController {
  constructor(private readonly alevaApiGatewayService: AlevaApiGatewayService, 
    private readonly authService: AuthService) {}

    @Get('protected-endpoint')
    @UseGuards(PassportJwtAuthGuard)
    getUserInfo(@Request() request) {
      return request.user;
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    login(@Body() input: AuthInput) {
        return this.authService.authenticate(input);
    }

}
