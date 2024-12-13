import * as joi from 'joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'

// services
import { ClientConfigService } from './client-config.service'


@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: false,
            validationSchema: joi.object({
                AUTH_CLIENT_PORT: joi.number().default(3001),
                RBAC_CLIENT_PORT: joi.number().default(3002),
                FORMS_CLIENT_PORT: joi.number().default(3003),
                ADDRESS_CLIENT_PORT: joi.number().default(3004),
                BOOKING_CLIENT_PORT: joi.number().default(3005),
                BILLING_CLIENT_PORT: joi.number().default(3006)
            })
        })
    ],
    providers: [ClientConfigService],
    exports: [ClientConfigService]
})

export class ClientConfigModule { }