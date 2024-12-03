import { Module } from '@nestjs/common';

// services
import { TestService } from './test.service';

// controllers
import { TestController } from './test.controller';


@Module({
  controllers: [TestController],
  providers: [TestService],
})
export class TestModule {}
