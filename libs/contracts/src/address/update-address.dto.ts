import { PartialType } from '@nestjs/mapped-types';

// dto
import { CreateAddressDto } from './create-address.dto';

export class UpdateUserDto extends PartialType(CreateAddressDto) {
    address_id: string;
}