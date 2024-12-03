import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

// modules
import { AuthModule } from './core/auth.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    {
      transport: Transport.TCP,
      options: {
        port: 3001,
      },
    }
  );

  await app.listen();
}
bootstrap();
