import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsBoolean, IsOptional } from 'class-validator';

// enum
import { EntityAddressTypeEnum } from '@app/contracts';

export class UpdateEntityAddressDto {
  @ApiPropertyOptional({ description: 'Unique ID of the entity address', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  @IsOptional()
  entity_address_id?: string;

  @ApiPropertyOptional({ description: 'Unique ID of the entity', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  @IsOptional()
  entity_id?: string;

  @ApiPropertyOptional({ description: 'Type of the entity', enum: EntityAddressTypeEnum, example: EntityAddressTypeEnum.USER })
  @IsEnum(EntityAddressTypeEnum)
  @IsOptional()
  entity_type?: EntityAddressTypeEnum;

  @ApiPropertyOptional({ description: 'Unique ID of the address', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  @IsOptional()
  address_id?: string;

  @ApiPropertyOptional({ description: 'Indicates if this is an emergency address', example: false })
  @IsBoolean()
  @IsOptional()
  emergency_address?: boolean;
}
