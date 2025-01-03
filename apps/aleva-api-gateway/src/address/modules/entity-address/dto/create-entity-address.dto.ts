import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsBoolean, IsOptional } from 'class-validator';

// enum
import { EntityAddressTypeEnum } from '@app/contracts';

export class CreateEntityAddressDto {
  @ApiProperty({ description: 'Unique ID of the entity', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  entity_id: string;

  @ApiProperty({ description: 'Type of the entity', enum: EntityAddressTypeEnum, example: EntityAddressTypeEnum.USER })
  @IsEnum(EntityAddressTypeEnum)
  entity_type: EntityAddressTypeEnum;

  @ApiProperty({ description: 'Unique ID of the address', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  address_id: string;

  @ApiProperty({ description: 'Indicates if this is an emergency address', example: false })
  @IsBoolean()
  @IsOptional()
  emergency_address?: boolean;
}
