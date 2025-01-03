import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty({ description: 'Type of address (e.g., "billing", "shipping")', example: 'billing' })
  @IsString()
  @IsNotEmpty()
  address_type: string;

  @ApiProperty({ description: 'Indicates if this is the primary address', example: true })
  @IsBoolean()
  @IsNotEmpty()
  primary: boolean;

  @ApiProperty({ description: 'Main address line', example: 'No. 3 Gem Street' })
  @IsString()
  @IsNotEmpty()
  address_1: string;

  @ApiProperty({ description: 'Secondary address line', example: 'East Adjiringanor' })
  @IsString()
  @IsNotEmpty()
  address_2: string;

  @ApiProperty({ description: 'City of the address', example: 'Adjiringanor' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ description: 'Region or state of the address', example: 'Greater Accra' })
  @IsString()
  @IsNotEmpty()
  region: string;

  @ApiProperty({ description: 'Country of the address', example: 'Ghana' })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ description: 'Postal/ZIP code of the address', example: '00233' })
  @IsString()
  @IsNotEmpty()
  address_postalcode: string;
}