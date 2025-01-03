import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

// enums
import { AccountTypeEnum, EntityAccountTypeEnum } from '@app/contracts';

export class CreateEntityAccountDto {
  @ApiProperty({ description: 'Unique ID of the associated account', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  account_id: string;

  @ApiProperty({ description: 'Type of the account', enum: AccountTypeEnum, example: AccountTypeEnum.SAVINGS })
  @IsEnum(AccountTypeEnum)
  account_type: AccountTypeEnum;

  @ApiProperty({ description: 'Unique ID of the entity', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  entity_id: string;

  @ApiProperty({ description: 'Type of the entity', enum: EntityAccountTypeEnum, example: EntityAccountTypeEnum.USER })
  @IsEnum(EntityAccountTypeEnum)
  entity_type: EntityAccountTypeEnum;
}