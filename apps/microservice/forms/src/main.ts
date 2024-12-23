import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';

// constants
import { FORMS } from 'apps/common/config/constants';

// modules
import { FormsAppModule } from './forms-app.module';

// services
import { ClientConfigService } from 'apps/common/config/client-config.service';


async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(FormsAppModule);
  const clientConfigService = appContext.get(ClientConfigService);
  const clientOptions = clientConfigService.getClientOptions(FORMS);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    FormsAppModule,
    clientOptions
  );

  await app.listen();
}
bootstrap();
