import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';

// constants
import { PROPERTIES, RESOURCE } from 'apps/common/config/constants';
import { PROPERTIES_CLIENT, RESOURCE_CLIENT } from '../../../common/utils/constants';

// services
import { PropertyService } from './property.service';
import { AmenitiesService } from '../amenities/amenities.service';
import { MediaService } from 'apps/aleva-api-gateway/src/resources/modules/media/media.service';

// controller
import { PropertyController } from './property.controller';

// config
import { ClientConfigModule, ClientConfigService } from '../../../../../common/config';

// module
import { AccountModule } from 'apps/aleva-api-gateway/src/billing/modules/account/account.module';
import { AddressModule } from 'apps/aleva-api-gateway/src/address/modules/address/address.module';
@Module({
  imports: [ClientConfigModule, AccountModule, AddressModule],
  controllers: [PropertyController],
  providers: [
    MediaService,
    AmenitiesService,
    PropertyService,
    {
      provide: PROPERTIES_CLIENT,
      useFactory(configService: ClientConfigService) {
        const clientOptions = configService.getClientOptions(PROPERTIES);
        return ClientProxyFactory.create(clientOptions);
      },
      inject: [ClientConfigService]
    },
    {
      provide: RESOURCE_CLIENT,
      useFactory(configService: ClientConfigService) {
        const clientOptions = configService.getClientOptions(RESOURCE);
        return ClientProxyFactory.create(clientOptions);
      },
      inject: [ClientConfigService]
    }
  ]
})
export class PropertyModule {}
