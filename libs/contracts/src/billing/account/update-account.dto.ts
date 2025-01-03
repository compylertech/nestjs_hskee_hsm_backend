// enum
import { AccountTypeEnum } from "./account.enum";

import { CreateAddressDto, UpdateAddressDto} from "@app/contracts";
export class UpdateAccountDto {
    account_id?: string;
    bank_account_name?: string;
    account_type?: AccountTypeEnum;
    bank_account_number?: string;
    account_branch_name?: string;

    address?: CreateAddressDto[] | UpdateAddressDto[];
}