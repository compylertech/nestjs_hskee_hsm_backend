import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { RpcException } from '@nestjs/microservices';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

// entity
import { Invoice } from './entities/invoice.entity';

// contracts
import { InvoiceDto, CreateInvoiceDto, UpdateInvoiceDto } from '@app/contracts';

// page-meta
import { PageDto } from 'apps/common/dto/page.dto';
import { PageMetaDto } from 'apps/common/dto/page-meta.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

@Injectable()
export class InvoiceService {
  constructor(@InjectRepository(Invoice) private readonly invoiceRepository: Repository<Invoice>) { }

  async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    try {
      const invoice = this.invoiceRepository.create(createInvoiceDto);

      return await this.invoiceRepository.save(invoice);
    } catch (error) {
      throw new RpcException(`Failed to create invoice ${error.message}`);
    }
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<InvoiceDto>> {
    try {
      const options = plainToInstance(PageOptionsDto, pageOptionsDto);
      const queryBuilder = this.invoiceRepository.createQueryBuilder('invoice');

      queryBuilder
        .leftJoinAndSelect('invoice.invoice_items', 'invoice_items')
        .orderBy('invoice.created_at', pageOptionsDto.order)
        .skip(options.skip)
        .take(options.limit);

      const itemCount = await queryBuilder.getCount();
      const { entities } = await queryBuilder.getRawAndEntities();
      const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
      const transformedEntities = plainToInstance(InvoiceDto, entities, { excludeExtraneousValues: false });

      return new PageDto(transformedEntities, pageMetaDto);
    } catch (error) {
      throw new RpcException('Failed to fetch invoices');
    }
  }

  async findOne(id: string): Promise<InvoiceDto> {
    try {
      const invoice = await this.findEntityById(id);

      return plainToInstance(InvoiceDto, invoice, { excludeExtraneousValues: false });
    } catch (error) {
      throw new RpcException(error.message || 'Failed to fetch invoice');
    }
  }


  async update(id: string, updateInvoiceDto: UpdateInvoiceDto): Promise<InvoiceDto> {
    const invoice = await this.findEntityById(id);

    // merge the updates into the invoice entity
    const updateInvoice = this.invoiceRepository.merge(invoice, updateInvoiceDto);
    await this.invoiceRepository.save(updateInvoice);

    return plainToInstance(InvoiceDto, updateInvoice, { excludeExtraneousValues: false });
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.invoiceRepository.delete(id);

      if (result.affected === 0) {
        throw new NotFoundException(`Invoice with ID ${id} not found`);
      }
    } catch (error) {
      throw new RpcException(error.message || 'Failed to delete invoice');
    }
  }

  private async findEntityById(id: string): Promise<Invoice> {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid UUID: ${id}`);
    }

    const invoice = await this.invoiceRepository.findOne({ where: { invoice_id: id } });

    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    return invoice;
  }
}
