import { ApiProperty } from "@nestjs/swagger";

export class AddressDto {
    @ApiProperty({ description: 'Address ID', example: '2eb5cd9f-c8e3-42be-8c0d-3018f64335e4' })
    address_id: string;
  
    @ApiProperty({ description: 'Address type', example: 'billing' })
    address_type: string;
  
    @ApiProperty({ description: 'Whether this is the primary address', example: true })
    primary: boolean;
  
    @ApiProperty({ description: 'Address line 1', example: 'No. 3 Gem Street' })
    address_1: string;
  
    @ApiProperty({ description: 'City', example: 'Tema' })
    city: string;
  
    @ApiProperty({ description: 'Region', example: 'Greater Accra' })
    region: string;
  
    @ApiProperty({ description: 'Country', example: 'Ghana' })
    country: string;
  
    @ApiProperty({ description: 'Postal code', example: '00233' })
    address_postalcode: string;
  }
  