import { PropertyStatus } from './property.enum';

export class CreatePropertyDto {
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
}