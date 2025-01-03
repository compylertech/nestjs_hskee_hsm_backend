// enum
import { PropertyStatus } from "./property.enum";

// dto
import { AccountDto, AddressDto, AmenitiesDto, MediaDto, UnitDto } from "@app/contracts";

export class PropertyDto {
  property_unit_assoc_id: string;
  name: string;
  property_type: string;
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
  units?: UnitDto[];
  media?: MediaDto[];
  amenities?: AmenitiesDto[];
  account?: AccountDto[];
  address?: AddressDto[];
}