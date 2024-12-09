import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

// constants
import { JWT_SECRET } from './configs/jwt-secret';

// strategies
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

// modules
import { UsersModule } from '../users/users.module';

// controllers
import { AuthController } from './auth.controller';
import { PassportAuthController } from './passport-auth.controller';

// services
import { AuthService } from './auth.service';

@Module({
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController, PassportAuthController],
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: JWT_SECRET,
      signOptions: {expiresIn: '1d'}
    }),
    PassportModule
  ],
  exports: [AuthService],
})
export class AuthModule {}