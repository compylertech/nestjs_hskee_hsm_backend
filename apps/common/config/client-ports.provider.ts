import { ConfigService } from '@nestjs/config';

export class ClientPortsProvider {
  constructor(private readonly config: ConfigService) {}

  /**
   * Dynamically fetch client port for a given service
   * @param serviceName Name of the microservice (e.g., "auth", "users")
   */
  getClientPort(serviceName: string): number {
    const portKey = `${serviceName.toUpperCase()}_CLIENT_PORT`;
    const port = this.config.get<number>(portKey);

    if (!port) {
      throw new Error(`Port not configured for service: ${serviceName}`);
    }
    
    return port;
  }
}