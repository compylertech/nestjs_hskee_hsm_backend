import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// entity
import { User } from './entities/user.entity';

// services
import { UsersService } from './users.service';

// controllers
import { UsersController } from './users.controller';

// subscribers
import { UserSubscriber } from './subscribers/users.subscribers';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, UserSubscriber],
  exports: [UsersService]
})
export class UsersModule {}
