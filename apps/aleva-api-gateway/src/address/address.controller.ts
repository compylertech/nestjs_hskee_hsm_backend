import { Controller } from '@nestjs/common';

// services
import { AddressService } from './address.service';


@Controller('address')
export class AddressController {
  constructor(private addressService: AddressService) {}

}