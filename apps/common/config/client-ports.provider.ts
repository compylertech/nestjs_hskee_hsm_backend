import { ConfigService } from '@nestjs/config';

export class ClientPortsProvider {
    constructor(private readonly config: ConfigService) {}

    getUsersClientPort(): number {
        return this.config.get<number>('USERS_CLIENT_PORT');
    }

    getAuthClientPort(): number {
        return this.config.get<number>('AUTH_CLIENT_PORT');
    }

    getFormsClientPort(): number {
        return this.config.get<number>('FORMS_CLIENT_PORT');
    }

    getRbacClientPort(): number {
        return this.config.get<number>('RBAC_CLIENT_PORT');
    }
}
