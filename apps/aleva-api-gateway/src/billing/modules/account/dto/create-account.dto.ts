import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateAccountDto {
    @ApiProperty({ description: 'Bank account name', example: 'John Doe' })
    @IsString()
    bank_account_name: string;

    @ApiProperty({ description: 'Bank account number', example: '123456789' })
    @IsString()
    bank_account_number: string;

    @ApiProperty({ description: 'Bank branch name', example: 'Downtown Branch' })
    @IsString()
    @ApiPropertyOptional()
    account_branch_name: string;
}
