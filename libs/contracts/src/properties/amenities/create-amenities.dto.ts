// dto
import { CreateMediaDto, UpdateMediaDto } from '@app/contracts';

export class CreateAmenitiesDto {
    amenity_name?: string;
    amenity_short_name?: string;
    description?: string;
    media?:  CreateMediaDto[] | UpdateMediaDto[];
}