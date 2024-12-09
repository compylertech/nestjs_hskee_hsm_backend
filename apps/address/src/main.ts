import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';

// modules
import { AddressAppModule } from './address-app.module';
import { ClientConfigService } from 'apps/common/config/client-config.service';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AddressAppModule);
  const clientConfigService = appContext.get(ClientConfigService);
  const clientOptions = clientConfigService.addressClientOptions;

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AddressAppModule,
    clientOptions
  );

  await app.listen();
}
bootstrap();
