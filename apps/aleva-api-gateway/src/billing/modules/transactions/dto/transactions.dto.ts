import { ApiProperty } from '@nestjs/swagger';

export class TransactionsDto {
  @ApiProperty({ description: 'Transaction ID', example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  transaction_id: string;

  @ApiProperty({ description: 'Transaction number', example: 'TXN123456' })
  transaction_number: string;

  @ApiProperty({ description: 'Payment type ID', example: 1 })
  payment_type_id: number;

  @ApiProperty({ description: 'Client who offered the transaction', example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  client_offered: string;

  @ApiProperty({ description: 'Client who requested the transaction', example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  client_requested: string;

  @ApiProperty({ description: 'Transaction date', example: '2024-08-22T17:17:54.520Z' })
  transaction_date: string;

  @ApiProperty({ description: 'Transaction details', example: 'Transaction for Invoice #INV123' })
  transaction_details: string;

  @ApiProperty({ description: 'Transaction type', example: 0 })
  transaction_type: number;

  @ApiProperty({ description: 'Transaction status', example: 'Completed' })
  transaction_status: string;

  @ApiProperty({ description: 'Invoice number associated with the transaction', example: 'INV123' })
  invoice_number: string;
}
