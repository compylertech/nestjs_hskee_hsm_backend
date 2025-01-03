import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

// enums
import { AccountTypeEnum, EntityAccountTypeEnum } from '@app/contracts';

export class UpdateEntityAccountDto {
  @ApiPropertyOptional({ description: 'Unique ID of the entity account', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  @IsOptional()
  entity_account_id?: string;

  @ApiPropertyOptional({ description: 'Unique ID of the associated account', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  @IsOptional()
  account_id?: string;

  @ApiPropertyOptional({ description: 'Type of the account', enum: AccountTypeEnum, example: AccountTypeEnum.SAVINGS })
  @IsEnum(AccountTypeEnum)
  @IsOptional()
  account_type?: AccountTypeEnum;

  @ApiPropertyOptional({ description: 'Unique ID of the entity', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  @IsOptional()
  entity_id?: string;

  @ApiPropertyOptional({ description: 'Type of the entity', enum: EntityAccountTypeEnum, example: EntityAccountTypeEnum.USER })
  @IsEnum(EntityAccountTypeEnum)
  @IsOptional()
  entity_type?: EntityAccountTypeEnum;
}
