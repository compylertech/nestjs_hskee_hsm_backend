import { Module, Type } from '@nestjs/common';
import { RouterModule, RouteTree } from '@nestjs/core';
import { Controller } from '@nestjs/common/interfaces';
import { ClientProxyFactory } from '@nestjs/microservices';

// constants
import { BOOKING_CLIENT } from '../common/utils/constants';

// services
import { BookingService } from './booking.service';

// controller
import { BookingController } from './booking.controller';

// config
import { ClientConfigModule, ClientConfigService } from '../../../common/config';

// module
// import { AnswersModule } from './modules/answers/answers.module';  // TODO: REMOVE AND ADD YOUR CALENDAR_EVENT MODULE HERE

function appendSubPathsToBaseModule(basePath: string, controllers: Type<Controller>[]): RouteTree[] {
  return controllers.map((controller) => {
    const controllerPath = Reflect.getMetadata('path', controller);

    return {
      path: `${basePath}`,
      module: controller as Type<Controller>,
    };
  });
}

@Module({
  imports: [
    ClientConfigModule, 
    // AnswersModule,  // TODO: REMOVE AND ADD YOUR CALENDAR_EVENT MODULE HERE
    RouterModule.register([
      {
        path: 'forms',
        children: [
          ...appendSubPathsToBaseModule('/', [
            // AnswersModule,  // TODO: REMOVE AND ADD YOUR CALENDAR_EVENT MODULE HERE
          ]),
        ],
      },
    ]),
  ],
  controllers: [BookingController],
  providers: [BookingService,
    {
      provide: BOOKING_CLIENT,
      useFactory(configService: ClientConfigService) {
        const clientOptions = configService.bookingClientOptions;
        return ClientProxyFactory.create(clientOptions);
      },
      inject: [ClientConfigService]
    }],
})
export class BookingModule { }
