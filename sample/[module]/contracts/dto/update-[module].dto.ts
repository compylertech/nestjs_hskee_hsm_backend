import { PartialType } from '@nestjs/mapped-types';

// dto
import { Create[Module]Dto } from './create-[module].dto';

export class Update[Module]Dto extends PartialType(Create[Module]Dto) {
   address_id: string;
}