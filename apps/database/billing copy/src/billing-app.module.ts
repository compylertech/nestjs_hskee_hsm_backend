import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

// config
import { ClientConfigModule } from 'apps/common/config';

// module
import { InvoiceModule } from './invoice/invoice.module';
import { AccountModule } from './account/account.module';
import { EntityAccountModule } from './entity-account/entity-account.module';
import { EntityBillableModule } from './entity-billable/entity-billable.module';

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
    InvoiceModule, AccountModule, EntityAccountModule, 
    EntityBillableModule, ClientConfigModule
  ],
  controllers: [],
  providers: [],
})
export class BillingAppModule { }
