// enum
import { AccountTypeEnum } from "./account.enum";

// dto
import { CreateAddressDto, UpdateAddressDto } from "@app/contracts";

export class CreateAccountDto {
    bank_account_name: string;
    account_type: AccountTypeEnum;
    bank_account_number: string;
    account_branch_name: string;
    address?: CreateAddressDto[] | UpdateAddressDto[];
}  