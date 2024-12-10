import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// client providers
import { ClientPortsProvider } from '../config/client-ports.provider';
import { ClientOptionsProvider } from '../config/client-options.provider';

@Injectable()
export class ClientConfigService {
    private readonly portsProvider: ClientPortsProvider;
    private readonly optionsProvider: ClientOptionsProvider;

    constructor(config: ConfigService) {
        this.portsProvider = new ClientPortsProvider(config);
        this.optionsProvider = new ClientOptionsProvider(this.portsProvider);
    }

    get usersClientOptions() {
        return this.optionsProvider.createClientOptions(this.portsProvider.getUsersClientPort());
    }

    get authClientOptions() {
        return this.optionsProvider.createClientOptions(this.portsProvider.getAuthClientPort());
    }

    get formClientOptions() {
        return this.optionsProvider.createClientOptions(this.portsProvider.getFormsClientPort());
    }

    get addressClientOptions() {
        return this.optionsProvider.createClientOptions(this.portsProvider.getAddressClientPort());
    }

    get rbacClientOptions() {
        return this.optionsProvider.createClientOptions(this.portsProvider.getRbacClientPort());
    }

    get bookingClientOptions() {
        return this.optionsProvider.createClientOptions(this.portsProvider.getBookingClientPort());
    }
}
