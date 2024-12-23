import { Module, Type } from '@nestjs/common';
import { RouterModule, RouteTree } from '@nestjs/core';
import { Controller } from '@nestjs/common/interfaces';
import { ClientProxyFactory } from '@nestjs/microservices';

// constants
import { FORMS } from 'apps/common/config/constants';
import { FORMS_CLIENT } from '../common/utils/constants';

// services
import { FormsService } from './forms.service';

// controller
import { FormsController } from './forms.controller';

// config
import { ClientConfigModule, ClientConfigService } from '../../../common/config';

// module
import { AnswersModule } from './modules/answers/answers.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { QuestionnaireModule } from './modules/questionnaire/questionnaire.module';

function appendSubPathsToBaseModule(basePath: string, controllers: Type<Controller>[]): RouteTree[] {
  return controllers.map((controller) => {
    const controllerPath = Reflect.getMetadata('path', controller);

    return {
      path: `${basePath}`,
      module: controller as Type<Controller>,
    };
  });
}

@Module({
  imports: [
    ClientConfigModule, 
    QuestionnaireModule,
    QuestionsModule,
    AnswersModule,
    RouterModule.register([
      {
        path: 'forms',
        children: [
          ...appendSubPathsToBaseModule('/', [AnswersModule, QuestionsModule, QuestionnaireModule]),
        ],
      },
    ]),
  ],
  controllers: [FormsController],
  providers: [FormsService,
    {
      provide: FORMS_CLIENT,
      useFactory(configService: ClientConfigService) {
        const clientOptions = configService.getClientOptions(FORMS);
        return ClientProxyFactory.create(clientOptions);
      },
      inject: [ClientConfigService]
    }],
})
export class FormsModule { }
