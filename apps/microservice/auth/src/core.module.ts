import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

// config
import { ClientConfigModule } from 'apps/common/config';

// modules
import { AuthModule } from './core/auth.module';
import { UsersModule } from './users/users.module';
import { AttendanceLogModule } from './attendance_log/attendance-log.module';

// entity
import { Answer } from '../../forms/src/answers/entities/answer.entity';
import { Question } from '../../forms/src/questions/entities/questions.entity';
import { Questionnaire } from '../../forms/src/questionnaire/entities/questionnaire.entity';
import { EntityQuestionnaire } from '../../forms/src/questionnaire/entities/entity-questionnaire.entity';

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
        entities: [EntityQuestionnaire, Questionnaire, Question, Answer],
        ssl: {
          rejectUnauthorized: true
        },
      }),
      inject: [ConfigService],
    }),
    UsersModule, AttendanceLogModule, AuthModule, ClientConfigModule
  ],
  controllers: [],
  providers: [],
})
export class CoreModule { }
