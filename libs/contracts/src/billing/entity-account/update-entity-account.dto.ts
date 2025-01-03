import { AccountTypeEnum } from "../account/account.enum";
import { EntityAccountTypeEnum } from "./entity-account.enum";

export class UpdateEntityAccountDto {
    entity_account_id?: string;
    account_id?: string;
    account_type?: AccountTypeEnum;
    entity_id?: string;
    entity_type?: EntityAccountTypeEnum;
}
