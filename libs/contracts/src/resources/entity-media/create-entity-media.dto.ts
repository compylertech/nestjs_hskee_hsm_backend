// enums
import { MediaType } from "../media/media.enum";
import { EntityMediaTypeEnum } from "./entity-media.enum";

export class CreateEntityMediaDto {
  media_id: string;
  entity_id: string;
  entity_type: EntityMediaTypeEnum;
  media_type?: MediaType;
}
