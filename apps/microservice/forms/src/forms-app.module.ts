import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

// config
import { ClientConfigModule } from 'apps/common/config';

// module
import { AnswersModule } from './answers/answers.module';
import { QuestionsModule } from './questions/questions.module';
import { QuestionnaireModule } from './questionnaire/questionnaire.module';

// entities
import { User } from '../../auth/src/users/entities/user.entity';
import { AttendanceLog } from '../../auth/src/attendance_log/entities/attendance-log.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: true,
        entities: [User, AttendanceLog],
        ssl: {
          rejectUnauthorized: true
        },
      }),
      inject: [ConfigService],
    }),
    QuestionsModule, AnswersModule, QuestionnaireModule, ClientConfigModule
  ],
  controllers: [],
  providers: [],
})
export class FormsAppModule { }