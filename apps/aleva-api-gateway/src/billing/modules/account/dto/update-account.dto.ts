import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

// dto
import { CreateAccountDto } from './create-account.dto';

export class UpdateAccountDto extends PartialType(CreateAccountDto) {
    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: 'Unique ID of the account', example: '123e4567-e89b-12d3-a456-426614174000' })
    account_id?: string;
}
