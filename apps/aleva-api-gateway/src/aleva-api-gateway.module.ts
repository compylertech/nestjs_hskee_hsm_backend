import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

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
import { ResourceModule } from './resources/resources.module';

@Module({
  imports: [AuthModule, AddressModule, UserModule, FormsModule, AttendanceLogModule, ResourceModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_HOST'),
          port: configService.get<number>('MAIL_PORT'),
          secure: configService.get<boolean>('MAIL_SECURE'),
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"No Reply" <${configService.get<string>('MAIL_FROM')}>`,
        },
        template: {
          dir: __dirname + '../../../../apps/templates',
          adapter: new HandlebarsAdapter(), 
          options: {
            strict: false
          },
        },
      }),
    }),
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
        path: 'resources',
        module: ResourceModule
      }
    ]),
  ],
  controllers: [AlevaApiGatewayController],
  providers: [AlevaApiGatewayService],
})

export class AlevaApiGatewayModule {}