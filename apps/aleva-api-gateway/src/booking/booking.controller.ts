import { Controller } from '@nestjs/common';

// services
import { BookingService } from './booking.service';

// dto

@Controller('booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}

}
