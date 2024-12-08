import { ClientOptions, Transport } from '@nestjs/microservices';

// providers
import { ClientPortsProvider } from './client-ports.provider';

export class ClientOptionsProvider {
    constructor(private readonly portsProvider: ClientPortsProvider) {}

    createClientOptions(port: number): ClientOptions {
        return {
            transport: Transport.TCP,
            options: {
                host: '127.0.0.1',
                port,
            },
        };
    }
}
