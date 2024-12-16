import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

// contracts
import { INVOICE_PATTERN, CreateInvoiceDto, UpdateInvoiceDto } from '@app/contracts';

// dto
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

// services
import { InvoiceService } from './invoice.service';

@Controller()
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) { }

  @MessagePattern(INVOICE_PATTERN.CREATE)
  async create(@Payload() createInvoiceDto: CreateInvoiceDto) {
    try {
      return await this.invoiceService.create(createInvoiceDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || 'Error creating invoice!',
      });
    }
  }

  @MessagePattern(INVOICE_PATTERN.FIND_ALL)
  async findAll(@Payload() pageOptionsDto: PageOptionsDto) {
    try {
      return await this.invoiceService.findAll(pageOptionsDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || 'Error fetching invoice!',
      });
    }
  }

  @MessagePattern(INVOICE_PATTERN.FIND_ONE)
  async findOne(@Payload() id: string) {
    try {
      return await this.invoiceService.findOne(id);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || `Error fetching invoice with id: ${id}`,
      });
    }
  }

  @MessagePattern(INVOICE_PATTERN.UPDATE)
  update(@Payload() updateUserDto: UpdateInvoiceDto) {
    try {
      return this.invoiceService.update(updateUserDto.invoice_id, updateUserDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || `Error updating invoice with id: ${updateUserDto.invoice_id}`,
      });
    }
  }

  @MessagePattern(INVOICE_PATTERN.REMOVE)
  async remove(@Payload() id: string) {
    await this.invoiceService.remove(id);
  }
}