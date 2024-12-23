import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// client providers
import { ClientPortsProvider } from './client-ports.provider';
import { ClientOptionsProvider } from './client-options.provider';

@Injectable()
export class ClientConfigService {
  private readonly portsProvider: ClientPortsProvider;
  private readonly optionsProvider: ClientOptionsProvider;

  constructor(config: ConfigService) {
    this.portsProvider = new ClientPortsProvider(config);
    this.optionsProvider = new ClientOptionsProvider(this.portsProvider);
  }

  /**
   * Dynamically get client options for any microservice
   */
  getClientOptions(serviceName: string) {
    const port = this.portsProvider.getClientPort(serviceName);
    return this.optionsProvider.createClientOptions(port);
  }
}
