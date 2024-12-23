import { PartialType } from '@nestjs/mapped-types';

// dto
import { CreateEntityMediaDto } from './create-entity-media.dto';

export class UpdateEntityMediaDto extends PartialType(CreateEntityMediaDto) {
  entity_media_id?: string;
}