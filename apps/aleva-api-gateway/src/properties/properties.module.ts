import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { ClientProxyFactory } from '@nestjs/microservices';

// constants
import { FORMS } from 'apps/common/config/constants';
import { FORMS_CLIENT } from '../common/utils/constants';

// helpers
import { appendSubPathsToBaseModule } from 'apps/common/utils/helpers';

// services
import { PropertiesService } from './properties.service';

// controller
import { PropertiesController } from './properties.controller';

// config
import { ClientConfigModule, ClientConfigService } from '../../../common/config';

// module
import { UnitModule } from './modules/unit/unit.module';
import { PropertyModule } from './modules/property/property.module';
import { RentalHistoryModule } from '@app/modules/properties/src/rental-history/rental-history.module';

@Module({
  imports: [
    UnitModule,
    PropertyModule,
    ClientConfigModule,
    RentalHistoryModule,
    RouterModule.register([
      {
        path: 'forms',
        children: [
          ...appendSubPathsToBaseModule('/', [PropertyModule, UnitModule, RentalHistoryModule]),
        ],
      },
    ]),
  ],
  controllers: [PropertiesController],
  providers: [PropertiesService,
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