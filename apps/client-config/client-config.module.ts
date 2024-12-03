import * as joi from 'joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'

// local imports
import { ClientConfigService } from './client-config.service'


@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: false,
            validationSchema: joi.object({
                AUTH_CLIENT_PORT: joi.number().default(3001),
                BOOKS_CLIENT_PORT: joi.number().default(3002),
                FORMS_CLIENT_PORT: joi.number().default(3003),
                TEST_CLIENT_PORT: joi.number().default(3006),
            })
        })
    ],
    providers: [ClientConfigService],
    exports: [ClientConfigService]
})

export class ClientConfigModule { }