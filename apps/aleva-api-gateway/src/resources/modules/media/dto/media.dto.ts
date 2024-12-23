import { IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// enum
import { MediaType } from '@app/contracts/resources/media/media.enum';

export class MediaDto {
  @ApiPropertyOptional({ description: 'Unique ID of the media', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsOptional()
  media_id?: string;

  @ApiProperty({ description: 'Name of the media file', example: 'example.png' })
  media_name: string | null;

  @ApiProperty({
    description: 'Type of the media file (e.g., image, video, audio)',
    enum: MediaType,
    example: MediaType.IMAGE,
  })
  media_type: MediaType | null;

  @ApiProperty({ description: 'URL of the media content', example: 'https://example.com/media/example.png' })
  content_url: string | null;

  @ApiProperty({ description: 'Indicates if the media is a thumbnail', example: false })
  is_thumbnail: boolean | null;

  @ApiProperty({ description: 'Caption for the media', example: 'An example media caption' })
  caption: string | null;

  @ApiProperty({ description: 'Description of the media content', example: 'This is an example media description.' })
  description: string | null;
}
