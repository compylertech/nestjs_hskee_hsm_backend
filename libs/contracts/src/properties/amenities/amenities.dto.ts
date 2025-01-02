// dto
import { MediaDto } from "@app/contracts/resources/media/media.dto";

export class AmenitiesDto {
    amenity_id: string;
    amenity_name?: string;
    amenity_short_name?: string;
    description?: string;
    media?: MediaDto[];
}