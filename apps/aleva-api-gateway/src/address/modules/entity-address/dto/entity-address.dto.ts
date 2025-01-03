import { ApiProperty } from '@nestjs/swagger';

// enum
import { EntityAddressTypeEnum } from '@app/contracts';

export class EntityAddressDto {
    @ApiProperty({ description: 'Unique ID of the entity address', example: '123e4567-e89b-12d3-a456-426614174000' })
    entity_address_id: string;

    @ApiProperty({ description: 'Unique ID of the entity', example: '123e4567-e89b-12d3-a456-426614174000' })
    entity_id: string;

    @ApiProperty({ description: 'Type of the entity', enum: EntityAddressTypeEnum, example: EntityAddressTypeEnum.USER })
    entity_type: EntityAddressTypeEnum;

    @ApiProperty({ description: 'Unique ID of the address', example: '123e4567-e89b-12d3-a456-426614174000' })
    address_id: string;

    @ApiProperty({ description: 'Indicates if this is an emergency address', example: false })
    emergency_address: boolean;
}