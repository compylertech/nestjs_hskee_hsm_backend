import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

// config
import { ClientConfigModule } from 'apps/common/config';

// module
import { AnswersModule } from './answers/answers.module';
import { QuestionsModule } from './questions/questions.module';
import { QuestionnaireModule } from './questionnaire/questionnaire.module';
import { EntityQuestionnaireModule } from './entity_questionnaire/entity-questionnaire.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const isSslEnabled = configService.get<string>('DB_SSL') === 'true';

        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_DATABASE'),
          autoLoadEntities: true,
          synchronize: true,
          ...(isSslEnabled && {
            ssl: {
              rejectUnauthorized: true,
            },
          }),
        }
      },
      inject: [ConfigService],
    }),
    EntityQuestionnaireModule, QuestionsModule, AnswersModule, QuestionnaireModule, ClientConfigModule
  ],
  controllers: [],
  providers: [],
})
export class FormsAppModule { }