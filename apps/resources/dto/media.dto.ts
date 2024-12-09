import { ApiProperty } from "@nestjs/swagger";

export class MediaDto {
    @ApiProperty({ description: 'Media ID', example: '51843b31-9d5a-4271-b57a-0258f2b4a31e' })
    media_id: string;
  
    @ApiProperty({ description: 'Media name', example: 'aleva_qr' })
    media_name: string;
  
    @ApiProperty({ description: 'Media type', example: 'image' })
    media_type: string;
  
    @ApiProperty({ description: 'Content URL', example: 'https://example.com/image.jpg' })
    content_url: string;
  
    @ApiProperty({ description: 'Whether this is a thumbnail', example: true })
    is_thumbnail: boolean;
  }
  