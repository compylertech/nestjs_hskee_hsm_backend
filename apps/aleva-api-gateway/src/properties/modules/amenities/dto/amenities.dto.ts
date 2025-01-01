import { ApiPropertyOptional } from '@nestjs/swagger';

export class AmenitiesDto {
  @ApiPropertyOptional({ description: 'Unique ID of the amenity', example: '123e4567-e89b-12d3-a456-426614174000' })
  amenity_id: string;

  @ApiPropertyOptional({ description: 'Name of the amenity', example: 'Swimming Pool' })
  amenity_name?: string;

  @ApiPropertyOptional({ description: 'Short name of the amenity', example: 'Pool' })
  amenity_short_name?: string;

  @ApiPropertyOptional({ description: 'Description of the amenity', example: 'A luxurious swimming pool' })
  description?: string;
}
