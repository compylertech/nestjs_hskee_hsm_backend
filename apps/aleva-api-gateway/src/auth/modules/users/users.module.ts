import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';

// constants
import { FORMS, MAIL, RBAC } from 'apps/common/config/constants';
import { FORMS_CLIENT, MAIL_CLIENT, RBAC_CLIENT } from '../../../common/utils/constants';

// config
import { ClientConfigModule, ClientConfigService } from '../../../../../common/config';

// controller
import { UsersController } from './users.controller';

// services
import { UsersService } from './users.service';
import { QuestionnaireService } from 'apps/aleva-api-gateway/src/forms/modules/questionnaire/questionnaire.service';

// module
import { MailModule } from '@app/modules/messaging/src/mail/mail.module';
import { MediaModule } from 'apps/aleva-api-gateway/src/resources/modules/media/media.module';
import { AddressModule } from 'apps/aleva-api-gateway/src/address/modules/address/address.module';

@Module({
  imports: [ClientConfigModule, MediaModule, AddressModule, MailModule],
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
    },
    {
      provide: MAIL_CLIENT,
      useFactory(configService: ClientConfigService) {
        const clientOptions = configService.getClientOptions(MAIL);
        return ClientProxyFactory.create(clientOptions);
      },
      inject: [ClientConfigService]
    }
  ],
  exports: [UsersService]
})
export class UserModule {}
