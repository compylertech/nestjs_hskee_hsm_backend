import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsBoolean } from 'class-validator';

// enum
import { MediaType } from '@app/contracts/resources/media/media.enum';

export class CreateMediaDto {
  @ApiProperty({ description: 'Name of the media file', example: 'example.png' })
  @IsString()
  @IsOptional()
  media_name?: string;

  @ApiProperty({
    description: 'Type of the media file (e.g., image, video, audio)',
    enum: MediaType,
    example: MediaType.IMAGE,
  })
  @IsEnum(MediaType)
  @IsOptional()
  media_type?: MediaType;

  @ApiProperty({ description: 'URL of the media content', example: 'https://example.com/media/example.png' })
  @IsString()
  @IsOptional()
  content_url?: string;

  @ApiProperty({ description: 'Indicates if the media is a thumbnail', example: false })
  @IsBoolean()
  @IsOptional()
  is_thumbnail?: boolean;

  @ApiProperty({ description: 'Caption for the media', example: 'An example media caption' })
  @IsString()
  @IsOptional()
  caption?: string;

  @ApiProperty({ description: 'Description of the media content', example: 'This is an example media description.' })
  @IsString()
  @IsOptional()
  description?: string;
}
