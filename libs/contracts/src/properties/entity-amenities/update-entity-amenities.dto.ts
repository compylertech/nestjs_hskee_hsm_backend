// enum
import { EntityAmenityTypeEnum } from "./entity-amenities.enum";

export class UpdateEntityAmenitiesDto {
  entity_amenities_id: string;
  amenity_id: string;
  entity_id: string;
  entity_type: EntityAmenityTypeEnum;
  apply_to_units: boolean;
}
