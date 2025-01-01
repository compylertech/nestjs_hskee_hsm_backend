// enum
import { PropertyStatus } from "../property/property.enum";

export class UnitDto {
  property_unit_assoc_id: string;
  property_unit_code: string;
  property_unit_floor_space: number;
  property_unit_amount: number;
  property_unit_security_deposit: number;
  property_unit_commission: number;
  property_floor_id: number;
  property_status: PropertyStatus;
  property_unit_notes: string;
  has_amenities: boolean;
  property_id: string;
}
