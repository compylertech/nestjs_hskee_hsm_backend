import { Controller, Request, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportLocalGuard } from './guards/passport-local.guard';
import { PassportJwtAuthGuard } from './guards/passport-jwt.guard';

@Controller('auth-v2')
export class PassportAuthController {
    constructor(private authService: AuthService) { }

    // @HttpCode(HttpStatus.OK)
    // @Post('login')
    // @UseGuards(PassportLocalGuard)
    // login(@Request() request) {
    //     return this.authService.signIn(request.user);
    // }

    // @Get('me-test')
    // @UseGuards(PassportJwtAuthGuard)
    // getUserInfo(@Request() request) {
    //    return request.user;
    // }
}