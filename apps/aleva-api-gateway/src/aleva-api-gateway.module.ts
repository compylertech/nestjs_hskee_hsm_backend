import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';

// controllers
import { AlevaApiGatewayController } from './aleva-api-gateway.controller';

// services
import { AlevaApiGatewayService } from './aleva-api-gateway.service';

// modules
import { AuthModule } from './auth/auth.module';
import { FormsModule } from './forms/forms.module';
import { AddressModule } from './address/address.module';
import { BookingModule } from './booking/booking.module';
import { UserModule } from './auth/modules/users/users.module';
import { AttendanceLogModule } from './auth/modules/attendance_log/attendance-log.module';
// import { BillingModule } from './billing/billing.module';
@Module({
  imports: [AuthModule, AddressModule, UserModule, FormsModule, AttendanceLogModule,
    // BillingModule,
    RouterModule.register([
      {
        path: 'forms',
        module: FormsModule,
      },
      {
        path: 'booking',
        module: BookingModule,
      },
      // {
      //   path: 'billing',
      //   module: BillingModule,
      // },
    ]),
  ],
  controllers: [AlevaApiGatewayController],
  providers: [AlevaApiGatewayService],
})
export class AlevaApiGatewayModule {}
