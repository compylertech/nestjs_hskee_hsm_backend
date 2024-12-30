// import { PartialType } from '@nestjs/mapped-types';
// import { CreateRentalHistoryDto } from './create-rental-history.dto';

export class UpdateRentalHistoryDto {
    rental_history_id?: string;
    start_date?: Date;
    end_date?: Date;
    property_owner_name?: string;
    property_owner_email?: string;
    property_owner_mobile?: string;
}
