import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

// contract
import { AccountTypeEnum, UpdateAddressDto } from '@app/contracts';

export class UpdateAccountDto {
    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: 'Unique ID of the account', example: '123e4567-e89b-12d3-a456-426614174000' })
    account_id?: string;

    @ApiPropertyOptional({ description: 'Bank account name', example: 'John Doe' })
    @IsOptional()
    @IsString()
    bank_account_name?: string;

    @ApiPropertyOptional({ description: 'Bank account number', example: '123456789' })
    @IsOptional()
    @IsString()
    bank_account_number?: string;
    
    @ApiPropertyOptional({ description: 'Type of the account', enum: AccountTypeEnum, example: AccountTypeEnum.SAVINGS })
    @IsOptional()
    account_type?: AccountTypeEnum;

    @ApiPropertyOptional({ description: 'Bank branch name', example: 'Downtown Branch' })
    @IsOptional()
    @IsString()
    account_branch_name?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateAddressDto)
    @IsOptional()
    address?: UpdateAddressDto[];
}
