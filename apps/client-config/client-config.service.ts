import { Injectable, } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'
import { ClientOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class ClientConfigService {
    constructor(private config: ConfigService) { }

    getBooksClientPort(): number {
        return this.config.get<number>('BOOKS_CLIENT_PORT');
    }

    getUsersClientPort(): number {
        return this.config.get<number>('USERS_CLIENT_PORT');
    }

    getAuthClientPort(): number {
        return this.config.get<number>('AUTH_CLIENT_PORT');
    }

    getFormsClientPort(): number {
        return this.config.get<number>('FORMS_CLIENT_PORT');
    }

    getTestClientPort(): number {
        return this.config.get<number>('TEST_CLIENT_PORT');
    }

    get bookClientOptions(): ClientOptions {
        return {
            transport: Transport.TCP,
            options: {
                port: this.getBooksClientPort()
            }
        }
    }

    get testClientOptions(): ClientOptions {
        return {
            transport: Transport.TCP,
            options: {
                port: this.getTestClientPort()
            }
        }
    }

    get usersClientOptions(): ClientOptions {
        return {
            transport: Transport.TCP,
            options: {
                port: this.getUsersClientPort()
            }
        }
    }

    get authClientOptions(): ClientOptions {
        return {
            transport: Transport.TCP,
            options: {
                port: this.getAuthClientPort()
            }
        }
    }

    get formClientOptions(): ClientOptions {
        return {
            transport: Transport.TCP,
            options: {
                host: '127.0.0.1',
                port: this.getFormsClientPort()
            }
        }
    }
}