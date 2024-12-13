import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';

// controllers
import { AlevaApiGatewayController } from './aleva-api-gateway.controller';

// services
import { AlevaApiGatewayService } from './aleva-api-gateway.service';

// modules
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/users.module';
import { FormsModule } from './forms/forms.module';
import { AddressModule } from './address/address.module';
import { BookingModule } from './booking/booking.module';
import { BillingModule } from './billing/billing.module';
@Module({
  imports: [AuthModule, AddressModule, UserModule, FormsModule, BookingModule, BillingModule,
    RouterModule.register([
      {
        path: 'forms',
        module: FormsModule,
      },
      {
        path: 'booking',
        module: BookingModule,
      },
      {
        path: 'billing',
        module: BillingModule,
      },
    ]),
  ],
  controllers: [AlevaApiGatewayController],
  providers: [AlevaApiGatewayService],
})
export class AlevaApiGatewayModule {}
