import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';

// constants
import { RBAC } from 'apps/common/config/constants';
import { AUTH_CLIENT } from '../../../common/utils/constants';

// config
import { ClientConfigModule, ClientConfigService } from '../../../../../common/config';

// services
import { PermissionsService } from '../permissions/permissions.service';

// controller
import { PermissionsController } from './permissions.controller';

@Module({
  imports: [ClientConfigModule],
  controllers: [PermissionsController],
  providers: [
    PermissionsService,
    {
      provide: AUTH_CLIENT,
      useFactory(configService: ClientConfigService) {
        const clientOptions = configService.getClientOptions(RBAC);
        return ClientProxyFactory.create(clientOptions);
      },
      inject: [ClientConfigService],
    },
  ],
})
export class PermissionsModule {}
