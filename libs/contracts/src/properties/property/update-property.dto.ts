import { PartialType } from '@nestjs/mapped-types';
import { CreatePropertyDto } from './create-property.dto';
import { PropertyTypeContract } from './property-info.dto';
import { PropertyStatus } from './property.enum';

// export class UpdatePropertyDto extends PartialType(CreatePropertyDto) {
//     property_unit_assoc_id?: string;
// }


export class UpdatePropertyDto {
    property_unit_assoc_id: string;
    name: string;
    property_type: PropertyTypeContract;
    amount: number;
    security_deposit: number;
    commission: number;
    floor_space: number;
    num_units: number;
    num_bathrooms: number;
    num_garages: number;
    has_balconies: boolean;
    has_parking_space: boolean;
    pets_allowed: boolean;
    description?: string;
    property_status: PropertyStatus;
}