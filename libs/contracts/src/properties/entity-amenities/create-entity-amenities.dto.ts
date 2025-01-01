// enum
import { EntityAmenityTypeEnum } from './entity-amenities.enum';

export class CreateEntityAmenitiesDto {
  amenity_id: string;
  entity_id: string;
  entity_type: EntityAmenityTypeEnum;
  apply_to_units: boolean;
}
