import { Body, Controller, Request, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';

// services
import { AuthService } from './auth.service';

// guards
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    // @HttpCode(HttpStatus.OK)
    // @Post('login')
    // login(@Body() input: { username: string; password: string }) {
    //     return this.authService.authenticate(input);
    // }

    // @UseGuards(AuthGuard)
    // @Get('me')
    // getUserInfo(@Request() request) {
    //    return request.user;
    // }
}
