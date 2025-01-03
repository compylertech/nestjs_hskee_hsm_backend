import { EntityAddressTypeEnum } from "./entity-address.enum";

export class UpdateEntityAddressDto {
    entity_address_id?: string;
    entity_id?: string;
    entity_type?: EntityAddressTypeEnum;
    address_id?: string;
    emergency_address?: boolean;
}