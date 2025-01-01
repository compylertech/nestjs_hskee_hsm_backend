import { ApiProperty } from '@nestjs/swagger';

export class AccountDto {
  @ApiProperty({ description: 'Unique ID of the account', example: '123e4567-e89b-12d3-a456-426614174000' })
  account_id: string;

  @ApiProperty({ description: 'Bank account name', example: 'John Doe' })
  bank_account_name: string;

  @ApiProperty({ description: 'Bank account number', example: '123456789' })
  bank_account_number: string;

  @ApiProperty({ description: 'Bank branch name', example: 'Downtown Branch' })
  account_branch_name: string;
}
