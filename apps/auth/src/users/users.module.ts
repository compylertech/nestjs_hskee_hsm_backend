import { Module } from '@nestjs/common';

// services
import { UsersService } from './users.service';

// controllers
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
