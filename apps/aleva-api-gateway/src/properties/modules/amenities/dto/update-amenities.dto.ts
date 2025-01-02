import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';

// dto
import { UpdateMediaDto } from '@app/contracts';
import { CreateAmenitiesDto } from './create-amenities.dto';

export class UpdateAmenitiesDto extends PartialType(CreateAmenitiesDto) {
  @ApiPropertyOptional({ description: 'Unique ID of the amenity', example: '123e4567-e89b-12d3-a456-426614174000' })
  amenity_id?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateMediaDto)
  @IsOptional()
  media?: UpdateMediaDto[];
}
