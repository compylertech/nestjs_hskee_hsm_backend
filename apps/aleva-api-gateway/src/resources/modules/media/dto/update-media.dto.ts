import { IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';

// dto
import { CreateMediaDto } from './create-media.dto';

export class UpdateMediaDto extends PartialType(CreateMediaDto) {
  @IsOptional()
  @ApiPropertyOptional({ description: 'Unique ID of the media', example: '123e4567-e89b-12d3-a456-426614174000' })
  media_id?: string;
}