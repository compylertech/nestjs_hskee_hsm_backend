import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ClientProxyFactory } from '@nestjs/microservices';

// constants
import { RBAC } from 'apps/common/config/constants';
import { AUTH_CLIENT } from '../common/utils/constants';

// config
import { ClientConfigModule, ClientConfigService } from 'apps/common/config';

// auth
import { JwtStrategy } from './strategies/jwt.strategy';

// services
import { AuthService } from './auth.service';

// controller
import { AuthController } from './auth.controller';

@Module({
  imports: [ClientConfigModule, PassportModule],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    AuthService,
    {
      provide: AUTH_CLIENT,
      useFactory(configService: ClientConfigService) {
        const clientOptions = configService.getClientOptions(RBAC);
        return ClientProxyFactory.create(clientOptions);
      },
      inject: [ClientConfigService]
    }
  ]
})
export class AuthModule {}
