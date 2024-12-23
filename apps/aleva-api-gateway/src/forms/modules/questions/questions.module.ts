import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';

// constants
import { FORMS } from 'apps/common/config/constants';
import { FORMS_CLIENT } from '../../../common/utils/constants';

// config
import { ClientConfigModule, ClientConfigService } from '../../../../../common/config';

// services
import { QuestionsService } from './questions.service';

// controller
import { QuestionsController } from './questions.controller';

@Module({
  imports: [ClientConfigModule],
  controllers: [QuestionsController],
  providers: [
    QuestionsService,
    {
      provide: FORMS_CLIENT,
      useFactory(configService: ClientConfigService) {
        const clientOptions = configService.getClientOptions(FORMS);
        return ClientProxyFactory.create(clientOptions);
      },
      inject: [ClientConfigService]
    }
  ]
})
export class QuestionsModule {}
