import {
  IsString,
  IsOptional,
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
  @ApiProperty({ description: 'Description of the invoice item', example: 'Game expert write trouble forget career.', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Quantity of the item', example: 2, required: false })
  @IsNumber()
  @IsOptional()
  @Min(1)
  quantity?: number;

  @ApiProperty({ description: 'Reference ID of the item', example: '44ebfba9-e184-4e46-ad36-758519649c9b', required: false })
  @IsUUID()
  @IsOptional()
  reference_id?: string;

  @ApiProperty({ description: 'Unit price of the item', example: 26273, required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  unit_price?: number;
}

export class InvoiceDto {
  @ApiProperty({ description: 'Unique identifier for the invoice', example: '123e4567-e89b-12d3-a456-426614174000' })
  invoice_id: string;

  @ApiProperty({ description: 'Date when the invoice was paid', example: '2024-12-07T05:15:27.582301', required: false })
  // @IsDateString()
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  date_paid?: Date;

  @ApiProperty({ description: 'Due date for the invoice payment', example: '2024-12-07T05:15:27.582301', required: false })
  // @IsDateString()
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  due_date?: Date;

  @ApiProperty({ description: 'Details of the invoice', example: 'Support hit kind us look. Allow forward put authority level.', required: false })
  @IsString()
  @IsOptional()
  invoice_details?: string;

  @ApiProperty({ description: 'Type of the invoice', example: 'lease', enum: ['sale', 'lease', 'other'], required: false })
  @IsEnum(InvoiceType)
  @IsOptional()
  invoice_type?: InvoiceType;

  @ApiProperty({ description: 'ID of the user or entity who issued the invoice', example: '4f9f519e-6220-49f7-8d6a-5a3035b6c8b3', required: false })
  @IsUUID()
  @IsOptional()
  issued_by?: string;

  @ApiProperty({ description: 'ID of the user or entity to whom the invoice is issued', example: '39a20310-d61e-4439-9592-54ead0a613bf', required: false })
  @IsUUID()
  @IsOptional()
  issued_to?: string;

  @ApiProperty({ description: 'Status of the invoice', example: 'reversal', enum: ['pending', 'paid', 'reversal', 'cancelled'], required: false })
  @IsEnum(InvoiceStatus)
  @IsOptional()
  status?: InvoiceStatus;

  @ApiProperty({ description: 'List of items in the invoice', type: [InvoiceItemDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceItemDto)
  @IsOptional()
  invoice_items?: InvoiceItemDto[];
}
