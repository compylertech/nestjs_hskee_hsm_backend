// enum
import { MediaType } from "../media/media.enum";
import { EntityMediaTypeEnum } from "./entity-media.enum";

export class EntityMediaDto {
  entity_media_id: string;
  media_id: string;
  entity_id: string;
  entity_type: EntityMediaTypeEnum;
  media_type: MediaType;
}