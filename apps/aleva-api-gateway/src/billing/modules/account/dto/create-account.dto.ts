import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

// enum
import { AccountTypeEnum, CreateAddressDto } from '@app/contracts';

export class CreateAccountDto {
    @ApiProperty({ description: 'Bank account name', example: 'John Doe' })
    @IsString()
    bank_account_name: string;

    @ApiProperty({ description: 'Bank account number', example: '123456789' })
    @IsString()
    bank_account_number: string;
    
    @ApiProperty({ description: 'Type of the account', enum: AccountTypeEnum, example: AccountTypeEnum.SAVINGS })
    account_type: AccountTypeEnum;

    @ApiProperty({ description: 'Bank branch name', example: 'Downtown Branch' })
    @IsString()
    @ApiPropertyOptional()
    account_branch_name: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateAddressDto)
    @IsOptional()
    address?: CreateAddressDto[];
}
