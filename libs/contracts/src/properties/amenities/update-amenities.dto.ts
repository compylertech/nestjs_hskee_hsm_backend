// dto
import { CreateMediaDto, UpdateMediaDto } from '@app/contracts';
export class UpdateAmenitiesDto {
    amenity_id?: string;
    amenity_name?: string;
    amenity_short_name?: string;
    description?: string;
    media?: CreateMediaDto[] | UpdateMediaDto[];
}