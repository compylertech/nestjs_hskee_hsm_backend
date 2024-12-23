import { MediaType } from "./media.enum";

export class CreateMediaDto {
    media_name?: string;
    media_type?: MediaType;
    content_url?: string;
    is_thumbnail?: boolean;
    caption?: string;
    description?: string;
  }
  