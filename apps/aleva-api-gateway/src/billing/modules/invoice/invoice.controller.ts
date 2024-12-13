import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Controller, Post, Get, Patch, Delete, Body, Param, Query, HttpCode } from '@nestjs/common';

// services
import { InvoiceService } from './invoice.service';

// dto
import { InvoiceDto } from './dto/invoice.dto';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

@ApiBearerAuth()
@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) { }

  @Post()
  @ApiOperation({ summary: 'Create Invoice' })
  @ApiResponse({ status: 200, description: 'Successfully fetched invoices.', type: InvoiceDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async create(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoiceService.create(createInvoiceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Fetch All Invoice' })
  @ApiResponse({ status: 200, description: 'Successfully fetched invoice.', type: InvoiceDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    let query = await this.invoiceService.findAll(pageOptionsDto);
    return query;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch Single Invoice' })
  @ApiResponse({ status: 200, description: 'Successfully fetched invoice.', type: InvoiceDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async findOne(@Param('id') id: string) {
    let query = await this.invoiceService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Invoice' })
  @ApiResponse({ status: 200, description: 'Successfully fetched invoice.', type: InvoiceDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async update(@Param('id') id: string, @Body() updateInvoiceDto: UpdateInvoiceDto) {
    let query = await this.invoiceService.update(id, updateInvoiceDto);
    return query;
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete Invoice' })
  async remove(@Param('id') invoiceId: string) {
    await this.invoiceService.remove(invoiceId);
  }

}