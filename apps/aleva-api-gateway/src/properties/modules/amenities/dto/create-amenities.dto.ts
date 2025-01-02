import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';

// dto
import { CreateMediaDto } from '@app/contracts';
export class CreateAmenitiesDto {
  @ApiPropertyOptional({ description: 'Name of the amenity', example: 'Swimming Pool' })
  @IsString()
  @IsOptional()
  amenity_name?: string;

  @ApiPropertyOptional({ description: 'Short name of the amenity', example: 'Pool' })
  @IsString()
  @IsOptional()
  amenity_short_name?: string;

  @ApiPropertyOptional({ description: 'Description of the amenity', example: 'A luxurious swimming pool' })
  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMediaDto)
  @IsOptional()
  media?: CreateMediaDto[];
}
