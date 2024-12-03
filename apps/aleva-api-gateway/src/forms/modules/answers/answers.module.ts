import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';

// constants
import { FORMS_CLIENT } from '../../../constants';

// services
import { AnswersService } from './answers.service';

// controller
import { AnswersController } from './answers.controller';

// config
import { ClientConfigModule, ClientConfigService } from 'apps/client-config';

@Module({
  imports: [ClientConfigModule],
  controllers: [AnswersController],
  providers: [
    AnswersService,
    {
      provide: FORMS_CLIENT,
      useFactory(configService: ClientConfigService) {
        const clientOptions = configService.formClientOptions;
        return ClientProxyFactory.create(clientOptions);
      },
      inject: [ClientConfigService],
    },
  ],
})
export class AnswersModule {}
