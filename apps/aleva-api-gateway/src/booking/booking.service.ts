import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

// constants
import { BOOKING_CLIENT } from '../common/utils/constants';

@Injectable()
export class BookingService {
  constructor(@Inject(BOOKING_CLIENT) private bookingClient: ClientProxy) { }

}
