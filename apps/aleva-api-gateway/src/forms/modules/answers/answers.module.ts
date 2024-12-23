import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';

// constants
import { FORMS } from 'apps/common/config/constants';
import { FORMS_CLIENT } from '../../../common/utils/constants';

// services
import { AnswerService } from './answers.service';

// controller
import { AnswerController } from './answers.controller';

// config
import { ClientConfigModule, ClientConfigService } from '../../../../../common/config';

@Module({
  imports: [ClientConfigModule],
  controllers: [AnswerController],
  providers: [
    AnswerService,
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
export class AnswersModule {}
