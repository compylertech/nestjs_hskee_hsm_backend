import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested, IsOptional } from 'class-validator';

// enum
import { AccountTypeEnum, AddressDto } from '@app/contracts';
export class AccountDto {
  @ApiProperty({ description: 'Unique ID of the account', example: '123e4567-e89b-12d3-a456-426614174000' })
  account_id: string;

  @ApiProperty({ description: 'Bank account name', example: 'John Doe' })
  bank_account_name: string;

  @ApiProperty({ description: 'Bank account number', example: '123456789' })
  bank_account_number: string;

  @ApiProperty({ description: 'Type of the account', enum: AccountTypeEnum, example: AccountTypeEnum.SAVINGS })
  account_type: AccountTypeEnum;

  @ApiProperty({ description: 'Bank branch name', example: 'Downtown Branch' })
  account_branch_name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  @IsOptional()
  address?: AddressDto[];
}
