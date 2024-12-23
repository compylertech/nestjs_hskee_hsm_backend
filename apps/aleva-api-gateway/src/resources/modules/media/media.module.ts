import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';

// constants
import { RESOURCE } from 'apps/common/config/constants';
import { RESOURCE_CLIENT } from '../../../common/utils/constants';

// config
import { ClientConfigModule, ClientConfigService } from '../../../../../common/config';

// services
import { MediaService } from './media.service';

// controller
import { MediaController } from './media.controller';

@Module({
  imports: [ClientConfigModule],
  controllers: [MediaController],
  providers: [
    MediaService,
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
export class MediaModule {}
