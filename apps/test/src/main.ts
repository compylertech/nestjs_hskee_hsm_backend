import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { TestAppModule } from './test-app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    TestAppModule,
    {
      transport: Transport.TCP,
      options: {
        port: 3006,
      },
    }
  );

  await app.listen();
}
bootstrap();