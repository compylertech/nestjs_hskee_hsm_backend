import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';

// constants
import { RESOURCE } from 'apps/common/config/constants';

// modules
import { ResourcesAppModule } from './resources-app.module';

// services
import { ClientConfigService } from 'apps/common/config/client-config.service';


async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(ResourcesAppModule);
  const clientConfigService = appContext.get(ClientConfigService);
  const clientOptions = clientConfigService.getClientOptions(RESOURCE);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ResourcesAppModule,
    clientOptions
  );

  await app.listen();
}
bootstrap();
