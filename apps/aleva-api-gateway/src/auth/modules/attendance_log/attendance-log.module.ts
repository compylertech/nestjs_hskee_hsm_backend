import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';

// constants
import { RBAC } from 'apps/common/config/constants';
import { AUTH_CLIENT } from '../../../common/utils/constants';

// config
import { ClientConfigModule, ClientConfigService } from '../../../../../common/config';

// services
import { AttendanceLogService } from './attendance-log.service';

// controller
import { AttendanceLogController } from './attendance-log.controller';
import { UsersModule } from '@app/modules/auth/src/users/users.module';

@Module({
  imports: [ClientConfigModule],
  controllers: [AttendanceLogController],
  providers: [
    AttendanceLogService,
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
export class AttendanceLogModule {}