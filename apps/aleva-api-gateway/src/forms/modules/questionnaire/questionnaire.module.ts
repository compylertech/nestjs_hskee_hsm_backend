import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';

// constants
import { FORMS, RBAC } from 'apps/common/config/constants';
import { FORMS_CLIENT, RBAC_CLIENT } from '../../../common/utils/constants';


// config
import { ClientConfigModule, ClientConfigService } from '../../../../../common/config';


// services
import { QuestionnaireService } from './questionnaire.service';

// controller
import { QuestionnaireController } from './questionnaire.controller';

@Module({
  imports: [ClientConfigModule],
  controllers: [QuestionnaireController],
  providers: [
    QuestionnaireService,
    {
      provide: FORMS_CLIENT,
      useFactory(configService: ClientConfigService) {
        const clientOptions = configService.getClientOptions(FORMS);
        return ClientProxyFactory.create(clientOptions);
      },
      inject: [ClientConfigService]
    },
    {
      provide: RBAC_CLIENT,
      useFactory(configService: ClientConfigService) {
        const clientOptions = configService.getClientOptions(RBAC);
        return ClientProxyFactory.create(clientOptions);
      },
      inject: [ClientConfigService]
    },
  ]
})
export class QuestionnaireModule {}
