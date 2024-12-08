import { ApiProperty } from "@nestjs/swagger";
import { AddressDto } from "./address.dto";

export class AccountDto {
    @ApiProperty({ description: 'Account ID', example: '7e3eea56-82d6-49c2-a623-85b4f68469ff' })
    account_id: string;
  
    @ApiProperty({ description: 'Account type', example: 'general' })
    account_type: string;
  
    @ApiProperty({ description: 'Bank account name', example: 'D-Quaidoo' })
    bank_account_name: string;
  
    @ApiProperty({ description: 'Bank account number', example: '14410099886655' })
    bank_account_number: string;
  
    @ApiProperty({ description: 'Branch name', example: 'Cantonments' })
    account_branch_name: string;
  
    @ApiProperty({ description: 'Address of the account', type: [AddressDto] })
    address: AddressDto[];
  }
  