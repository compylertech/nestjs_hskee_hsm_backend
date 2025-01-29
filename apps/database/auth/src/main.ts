import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions } from '@nestjs/microservices';

// constants
import { RBAC } from 'apps/common/config/constants';

// modules
import { CoreModule } from './core.module';

// configs
import { ClientConfigService } from 'apps/common/config/client-config.service';

// filters
import { GlobalRpcExceptionFilter } from '../../../common/filters/global-rpc-exception.filter';


async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(CoreModule);
  const clientConfigService = appContext.get(ClientConfigService);
  const clientOptions = clientConfigService.getClientOptions(RBAC);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    CoreModule,
    clientOptions
  );
  app.useGlobalFilters(new GlobalRpcExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen();
}
bootstrap();