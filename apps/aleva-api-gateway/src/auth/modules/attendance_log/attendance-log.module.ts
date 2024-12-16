import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';

// constants
import { AUTH_CLIENT } from '../../../common/utils/constants';

// services
import { AttendanceLogService } from './attendance-log.service';

// controller
import { AttendanceLogController } from './attendance-log.controller';

// config
import { ClientConfigModule, ClientConfigService } from '../../../../../common/config';

@Module({
  imports: [ClientConfigModule],
  controllers: [AttendanceLogController],
  providers: [
    AttendanceLogService,
    {
      provide: AUTH_CLIENT,
      useFactory(configService: ClientConfigService) {
        const clientOptions = configService.rbacClientOptions;
        return ClientProxyFactory.create(clientOptions);
      },
      inject: [ClientConfigService]
    }
  ]
})
export class AttendanceLogModule {}
