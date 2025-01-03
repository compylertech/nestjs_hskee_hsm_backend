import { AccountTypeEnum } from "../account/account.enum";
import { EntityAccountTypeEnum } from "./entity-account.enum";

export class CreateEntityAccountDto {
    account_id: string;
    account_type?: AccountTypeEnum;
    entity_id: string;
    entity_type: EntityAccountTypeEnum;

    static keys(): string[] {
        return ['account_id', 'account_type'];
    }
}