import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';

// constants
import { MAIL } from 'apps/common/config/constants';

// modules
import { BookingAppModule } from './booking-app.module';

// services
import { ClientConfigService } from 'apps/common/config/client-config.service';


async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(BookingAppModule);
  const clientConfigService = appContext.get(ClientConfigService);
  const clientOptions = clientConfigService.getClientOptions(MAIL);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    BookingAppModule,
    clientOptions
  );

  await app.listen();
}
bootstrap();
