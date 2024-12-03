import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';

// constants
import { TEST_CLIENT } from '../constants';

// services
import { TestService } from './test.service';

// controller
import { TestController } from './test.controller';

// config
import { ClientConfigModule, ClientConfigService } from '../../../client-config';

@Module({
  imports: [ClientConfigModule],
  controllers: [TestController],
  providers: [TestService,
    {
      provide: TEST_CLIENT,
      useFactory(configService: ClientConfigService) {
        const clientOptions = configService.testClientOptions;
        return ClientProxyFactory.create(clientOptions);
      },
      inject: [ClientConfigService]
    }],
})
export class TestModule { }
