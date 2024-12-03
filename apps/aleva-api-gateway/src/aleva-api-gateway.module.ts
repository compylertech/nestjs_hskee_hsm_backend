import { Module } from '@nestjs/common';

// controllers
import { AlevaApiGatewayController } from './aleva-api-gateway.controller';

// services
import { AlevaApiGatewayService } from './aleva-api-gateway.service';

// modules
import { UserModule } from './users/users.module';
import { FormsModule } from './forms/forms.module';
import { AuthModule } from 'apps/auth/src/core/auth.module';
import { FormsAppModule } from 'apps/forms/src/forms-app.module';

@Module({
  imports: [UserModule, FormsAppModule, AuthModule],
  controllers: [AlevaApiGatewayController],
  providers: [AlevaApiGatewayService],
})
export class AlevaApiGatewayModule {}
