import { EntityAddressTypeEnum } from "./entity-address.enum";

export class CreateEntityAddressDto {
    entity_id: string;
    entity_type: EntityAddressTypeEnum;
    address_id: string;
    emergency_address?: boolean;

    static keys(): string[] {
        return ['address_id', 'emergency_address'];
    }
}