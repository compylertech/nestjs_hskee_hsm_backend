import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';

// constants
import { PROPERTIES, RESOURCE } from 'apps/common/config/constants';
import { PROPERTIES_CLIENT, RESOURCE_CLIENT} from '../../../common/utils/constants';

// services
import { AmenitiesService } from './amenities.service';
import { MediaService } from 'apps/aleva-api-gateway/src/resources/modules/media/media.service';

// controller
import { AmenitiesController } from './amenities.controller';

// config
import { ClientConfigModule, ClientConfigService } from '../../../../../common/config';

@Module({
  imports: [ClientConfigModule],
  controllers: [AmenitiesController],
  providers: [
    MediaService,
    AmenitiesService,
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
export class AmenitiesModule {}
