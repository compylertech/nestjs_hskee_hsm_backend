import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';

// constants
import { USERS_CLIENT } from '../constants';

// services
import { UsersService } from './users.service';

// controller
import { UsersController } from './users.controller';

// config
import { ClientConfigModule, ClientConfigService } from '../../../client-config';

@Module({
  imports: [ClientConfigModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: USERS_CLIENT,
      useFactory(configService: ClientConfigService) {
        const clientOptions = configService.usersClientOptions;
        return ClientProxyFactory.create(clientOptions);
      },
      inject: [ClientConfigService]
    }
  ]
})
export class UserModule {}
