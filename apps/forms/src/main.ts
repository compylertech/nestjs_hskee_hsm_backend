import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';

// modules
import { FormsAppModule } from './forms-app.module';
import { ClientConfigService } from 'apps/client-config/client-config.service';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(FormsAppModule);
  const clientConfigService = appContext.get(ClientConfigService);
  const clientOptions = clientConfigService.formClientOptions;

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    FormsAppModule,
    clientOptions
  );

  await app.listen();
}
bootstrap();
