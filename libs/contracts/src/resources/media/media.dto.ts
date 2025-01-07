import { MediaType } from "./media.enum";

export class MediaDto {
    media_id: string;
    media_name: string | null;
    media_type: MediaType | null;
    content_url: string | null;
    is_thumbnail: boolean | null;
    caption: string | null;
    description: string | null;
    media? : MediaDto
  }
  