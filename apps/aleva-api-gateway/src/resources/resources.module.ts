import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { ClientProxyFactory } from '@nestjs/microservices';

// constants
import { RESOURCE } from 'apps/common/config/constants';
import { RESOURCE_CLIENT } from '../common/utils/constants';

// config
import { ClientConfigModule, ClientConfigService } from '../../../common/config';

// helpers
import { appendSubPathsToBaseModule } from 'apps/common/utils/helpers';

// module
import { MediaModule } from './modules/media/media.module';

// services
import { ResourceService } from './resources.service';

// controller
import { ResourceController } from './resources.controller';


@Module({
  imports: [
    ClientConfigModule, 
    MediaModule,
    RouterModule.register([
      {
        path: '',
        children: [
          ...appendSubPathsToBaseModule('/', [MediaModule]),
        ],
      },
    ]),
  ],
  controllers: [ResourceController],
  providers: [ResourceService,
    {
      provide: RESOURCE_CLIENT,
      useFactory(configService: ClientConfigService) {
        const clientOptions = configService.getClientOptions(RESOURCE);
        return ClientProxyFactory.create(clientOptions);
      },
      inject: [ClientConfigService]
    }],
})
export class ResourceModule { }
