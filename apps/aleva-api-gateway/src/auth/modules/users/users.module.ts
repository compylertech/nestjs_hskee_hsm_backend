import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';

// constants
import { FORMS, RBAC } from 'apps/common/config/constants';
import { FORMS_CLIENT, RBAC_CLIENT } from '../../../common/utils/constants';

// config
import { ClientConfigModule, ClientConfigService } from '../../../../../common/config';

// controller
import { UsersController } from './users.controller';

// services
import { UsersService } from './users.service';
import { QuestionnaireService } from 'apps/aleva-api-gateway/src/forms/modules/questionnaire/questionnaire.service';

@Module({
  imports: [ClientConfigModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    QuestionnaireService,
    {
      provide: RBAC_CLIENT,
      useFactory(configService: ClientConfigService) {
        const clientOptions = configService.getClientOptions(RBAC);
        return ClientProxyFactory.create(clientOptions);
      },
      inject: [ClientConfigService]
    },
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
export class UserModule {}
