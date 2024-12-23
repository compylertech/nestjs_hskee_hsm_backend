import { PartialType } from '@nestjs/mapped-types';

// dto
import { CreateInvoiceDto } from './create-invoice.dto';

export class UpdateInvoiceDto extends PartialType(CreateInvoiceDto) {
    invoice_id?: string
}