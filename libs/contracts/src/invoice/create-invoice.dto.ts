export class CreateInvoiceDto {
  date_paid: Date;
  due_date: Date;
  invoice_details: string;
  invoice_type: 'sale' | 'lease' | 'other';
  issued_by: string;
  issued_to: string;
  status: 'pending' | 'paid' | 'expired' | 'cancelled';
  invoice_items?: Array<{
    description?: string;
    quantity: number;
    reference_id: string;
    unit_price: number;
  }>;
}