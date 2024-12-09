import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';

// constants
import { FORMS_CLIENT } from '../../../common/utils/constants';

// services
import { QuestionsService } from './questions.service';

// controller
import { QuestionsController } from './questions.controller';

// config
import { ClientConfigModule, ClientConfigService } from 'apps/common/config';

@Module({
  imports: [ClientConfigModule],
  controllers: [QuestionsController],
  providers: [
    QuestionsService,
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
export class QuestionsModule {}
