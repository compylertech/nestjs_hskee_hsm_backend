import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsEnum,
  IsUUID,
  IsArray,
  ValidateNested,
  IsNumber,
  Min,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

// enums
import { InvoiceStatus, InvoiceType } from './invoice.enums';

export class InvoiceItemDto {
  @ApiProperty({ description: 'Description of the invoice item', example: 'Game expert write trouble forget career.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Quantity of the item', example: 2 })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ description: 'Reference ID of the item', example: '44ebfba9-e184-4e46-ad36-758519649c9b' })
  @IsUUID()
  reference_id: string;

  @ApiProperty({ description: 'Unit price of the item', example: 26273 })
  @IsNumber()
  @Min(0)
  unit_price: number;
}

export class CreateInvoiceDto {
  @ApiProperty({ description: 'Date when the invoice was paid', example: '2024-12-07T05:15:27.582301' })
  // @IsDateString()
  @IsDate()
  @Type(() => Date)
  date_paid: Date;

  @ApiProperty({ description: 'Due date for the invoice payment', example: '2024-12-07T05:15:27.582301' })
  // @IsDateString()
  @IsDate()
  @Type(() => Date)
  due_date: Date;

  @ApiProperty({ description: 'Details of the invoice', example: 'Support hit kind us look. Allow forward put authority level.' })
  @IsString()
  @IsNotEmpty()
  invoice_details: string;

  @ApiProperty({ description: 'Type of the invoice', example: 'lease', enum: ['sale', 'lease', 'other'] })
  @IsEnum(InvoiceType)
  invoice_type: InvoiceType;

  @ApiProperty({ description: 'ID of the user or entity who issued the invoice', example: '4f9f519e-6220-49f7-8d6a-5a3035b6c8b3' })
  @IsUUID()
  issued_by: string;

  @ApiProperty({ description: 'ID of the user or entity to whom the invoice is issued', example: '39a20310-d61e-4439-9592-54ead0a613bf' })
  @IsUUID()
  issued_to: string;

  @ApiProperty({ description: 'Status of the invoice', example: 'expired', enum: ['pending', 'paid', 'expired', 'cancelled'] })
  @IsEnum(InvoiceStatus)
  status: InvoiceStatus;

  @ApiProperty({ description: 'List of items in the invoice', type: [InvoiceItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceItemDto)
  invoice_items: InvoiceItemDto[];
}
