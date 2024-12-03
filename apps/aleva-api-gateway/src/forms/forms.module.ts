import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';

// constants
import { FORMS_CLIENT } from '../constants';

// services
import { FormsService } from './forms.service';

// controller
import { FormsController } from './forms.controller';

// config
import { ClientConfigModule, ClientConfigService } from '../../../client-config';

// module
import { AnswersModule } from './modules/answers/answers.module';
import { QuestionsModule } from './modules/questions/questions.module';

@Module({
  imports: [ClientConfigModule, QuestionsModule, AnswersModule],
  controllers: [FormsController],
  providers: [FormsService,
    {
      provide: FORMS_CLIENT,
      useFactory(configService: ClientConfigService) {
        const clientOptions = configService.formClientOptions;
        return ClientProxyFactory.create(clientOptions);
      },
      inject: [ClientConfigService]
    }],
})
export class FormsModule { }
