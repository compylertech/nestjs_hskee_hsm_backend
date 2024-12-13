import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';

// modules
import { BillingAppModule } from './billing-app.module';
import { ClientConfigService } from 'apps/common/config/client-config.service';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(BillingAppModule);
  const clientConfigService = appContext.get(ClientConfigService);
  const clientOptions = clientConfigService.billingClientOptions;

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    BillingAppModule,
    clientOptions
  );

  await app.listen();
}
bootstrap();
