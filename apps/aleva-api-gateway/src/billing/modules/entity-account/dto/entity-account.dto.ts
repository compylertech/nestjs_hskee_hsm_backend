import { ApiProperty } from '@nestjs/swagger';

// enums
import { AccountTypeEnum, EntityAccountTypeEnum } from '@app/contracts';

export class EntityAccountDto {
    @ApiProperty({ description: 'Unique ID of the entity account', example: '123e4567-e89b-12d3-a456-426614174000' })
    entity_account_id: string;

    @ApiProperty({ description: 'Unique ID of the associated account', example: '123e4567-e89b-12d3-a456-426614174000' })
    account_id: string;

    @ApiProperty({ description: 'Type of the account', enum: AccountTypeEnum, example: AccountTypeEnum.SAVINGS })
    account_type: AccountTypeEnum;

    @ApiProperty({ description: 'Unique ID of the entity', example: '123e4567-e89b-12d3-a456-426614174000' })
    entity_id: string;

    @ApiProperty({ description: 'Type of the entity', enum: EntityAccountTypeEnum, example: EntityAccountTypeEnum.USER })
    entity_type: EntityAccountTypeEnum;
}