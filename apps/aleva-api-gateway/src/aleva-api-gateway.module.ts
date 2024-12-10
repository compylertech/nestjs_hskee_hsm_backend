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
@Module({
  imports: [AuthModule, AddressModule, UserModule, FormsModule, BookingModule,
    RouterModule.register([
      {
        path: 'forms',
        module: FormsModule,
      },
      {
        path: 'booking',
        module: BookingModule,
      },
    ]),
  ],
  controllers: [AlevaApiGatewayController],
  providers: [AlevaApiGatewayService],
})
export class AlevaApiGatewayModule {}
