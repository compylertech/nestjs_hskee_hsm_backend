import { Controller } from '@nestjs/common';

// services
import { BillingService } from './billing.service';

// dto

@Controller('billing')
export class BillingController {
  constructor(private billingService: BillingService) {}

}
