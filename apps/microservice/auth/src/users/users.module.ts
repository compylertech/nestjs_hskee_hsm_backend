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
import { MailModule } from '@app/modules/messaging/src/mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), MailModule],
  controllers: [UsersController],
  providers: [UsersService, UserSubscriber],
  exports: [UsersService]
})
export class UsersModule {}
