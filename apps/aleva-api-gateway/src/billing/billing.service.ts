import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

// constants
import { BILLING_CLIENT } from '../common/utils/constants';

@Injectable()
export class BillingService {
  constructor(@Inject(BILLING_CLIENT) private billingClient: ClientProxy) { }

}
