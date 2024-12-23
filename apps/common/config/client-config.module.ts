import * as joi from 'joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// services
import { ClientConfigService } from './client-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: false,
      validationSchema: joi.object().pattern(
        /^([A-Z_]+_CLIENT_PORT)$/,
        joi.number().default(3000)
      ),
    }),
  ],
  providers: [ClientConfigService],
  exports: [ClientConfigService],
})

export class ClientConfigModule {}