// enum
import { AccountTypeEnum } from "./account.enum";

// contract
import { AddressDto } from "@app/contracts";
export class AccountDto {
    account_id: string;
    account_type: AccountTypeEnum;
    bank_account_name: string;
    bank_account_number: string;
    account_branch_name: string;
    address?: AddressDto[];
}
