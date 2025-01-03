import { PartialType } from '@nestjs/mapped-types';

// dto
import { CreateAddressDto } from './create-address.dto';

export class UpdateAddressDto extends PartialType(CreateAddressDto) {
    address_id?: string;
}