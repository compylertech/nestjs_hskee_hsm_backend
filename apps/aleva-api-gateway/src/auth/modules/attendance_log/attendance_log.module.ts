import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';

// constants
import { ATTENDANCE_LOG_CLIENT } from '../common/utils/constants';

// services
import { Attendance_logService } from './attendance_log.service';

// controller
import { Attendance_logController } from './attendance_log.controller';

// config
import { ClientConfigModule, ClientConfigService } from '../../../common/config';

@Module({
  imports: [ClientConfigModule],
  controllers: [Attendance_logController],
  providers: [
    Attendance_logService,
    {
      provide: ATTENDANCE_LOG_CLIENT,
      useFactory(configService: ClientConfigService) {
        const clientOptions = configService.attendance_logClientOptions;
        return ClientProxyFactory.create(clientOptions);
      },
      inject: [ClientConfigService]
    }
  ]
})
export class Attendance_logModule {}
