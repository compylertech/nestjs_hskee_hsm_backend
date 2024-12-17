import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';

// constants
import { FORMS_CLIENT, RBAC_CLIENT } from '../../../common/utils/constants';

// services
import { UsersService } from './users.service';

// controller
import { UsersController } from './users.controller';

// config
import { ClientConfigModule, ClientConfigService } from '../../../../../common/config';
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
        const clientOptions = configService.rbacClientOptions;
        return ClientProxyFactory.create(clientOptions);
      },
      inject: [ClientConfigService]
    },
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
export class UserModule {}
