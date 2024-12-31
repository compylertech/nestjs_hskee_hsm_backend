import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsBoolean, IsEnum } from 'class-validator';

// enum
import { PropertyStatus } from '@app/contracts/properties/property/property.enum';

export class CreateUnitDto {
  @ApiProperty()
  @IsString()
  property_unit_code: string;

  @ApiProperty()
  @IsNumber()
  property_unit_floor_space: number;

  @ApiProperty()
  @IsNumber()
  property_unit_amount: number;

  @ApiProperty()
  @IsNumber()
  property_unit_security_deposit: number;

  @ApiProperty()
  @IsNumber()
  property_unit_commission: number;

  @ApiProperty()
  @IsNumber()
  property_floor_id: number;

  @ApiProperty({ enum: PropertyStatus })
  @IsEnum(PropertyStatus)
  property_status: PropertyStatus;

  @ApiProperty()
  @IsOptional()
  @IsString()
  property_unit_notes?: string;

  @ApiProperty()
  @IsBoolean()
  has_amenities: boolean;

  @ApiProperty()
  @IsString()
  property_id: string;
}
