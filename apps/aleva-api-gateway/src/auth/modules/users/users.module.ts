import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';

// constants
import { RBAC_CLIENT } from '../../../common/utils/constants';

// services
import { UsersService } from './users.service';

// controller
import { UsersController } from './users.controller';

// config
import { ClientConfigModule, ClientConfigService } from '../../../../../common/config';

@Module({
  imports: [ClientConfigModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: RBAC_CLIENT,
      useFactory(configService: ClientConfigService) {
        const clientOptions = configService.rbacClientOptions;
        return ClientProxyFactory.create(clientOptions);
      },
      inject: [ClientConfigService]
    }
  ]
})
export class UserModule {}
