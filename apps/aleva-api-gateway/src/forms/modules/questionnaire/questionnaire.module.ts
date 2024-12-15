import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';

// constants
import { FORMS_CLIENT } from '../../../common/utils/constants';

// services
import { QuestionnaireService } from './questionnaire.service';

// controller
import { QuestionnaireController } from './questionnaire.controller';

// config
import { ClientConfigModule, ClientConfigService } from '../../../../../common/config';

@Module({
  imports: [ClientConfigModule],
  controllers: [QuestionnaireController],
  providers: [
    QuestionnaireService,
    {
      provide: FORMS_CLIENT,
      useFactory(configService: ClientConfigService) {
        const clientOptions = configService.formClientOptions;
        return ClientProxyFactory.create(clientOptions);
      },
      inject: [ClientConfigService]
    }
  ]
})
export class QuestionnaireModule {}
