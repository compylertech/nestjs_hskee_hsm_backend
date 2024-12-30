import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';

// constants
import { PROPERTIES } from 'apps/common/config/constants';

// modules
import { PropertiesAppModule } from './properties-app.module';

// services
import { ClientConfigService } from 'apps/common/config/client-config.service';


async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(PropertiesAppModule);
  const clientConfigService = appContext.get(ClientConfigService);
  const clientOptions = clientConfigService.getClientOptions(PROPERTIES);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    PropertiesAppModule,
    clientOptions
  );

  await app.listen();
}
bootstrap();
