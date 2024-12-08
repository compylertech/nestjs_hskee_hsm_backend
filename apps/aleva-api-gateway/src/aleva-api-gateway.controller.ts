import { Controller } from '@nestjs/common';

// service
import { AlevaApiGatewayService } from './aleva-api-gateway.service';

@Controller()
export class AlevaApiGatewayController {
  constructor(private readonly alevaApiGatewayService: AlevaApiGatewayService) {}
}