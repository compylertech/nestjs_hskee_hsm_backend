import { map } from 'rxjs';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

// constants
import { BILLING_CLIENT } from '../../../common/utils/constants';

// contracts
import {
  INVOICE_PATTERN,
  InvoiceDto as ClientInvoiceDto,
  CreateInvoiceDto as ClientCreateInvoiceDto,
  UpdateInvoiceDto as ClientUpdateInvoiceDto
} from '@app/contracts';

// dto
import { InvoiceDto } from './dto/invoice.dto';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

@Injectable()
export class InvoiceService {
  constructor(@Inject(BILLING_CLIENT) private readonly invoiceClient: ClientProxy) { }

  async create(createInvoiceDto: CreateInvoiceDto): Promise<ClientInvoiceDto> {
    const createInvoiceContract: CreateInvoiceDto = { ...createInvoiceDto };

    return this.invoiceClient.send<ClientInvoiceDto, ClientCreateInvoiceDto>(
      INVOICE_PATTERN.CREATE, createInvoiceContract
    ).toPromise();
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<ClientInvoiceDto[]> {
    return this.invoiceClient.send<ClientInvoiceDto[]>(
      INVOICE_PATTERN.FIND_ALL,
      pageOptionsDto
    ).toPromise();
  }

  async findOne(invoiceId: string): Promise<ClientInvoiceDto> {
    return this.invoiceClient
      .send<ClientInvoiceDto>(INVOICE_PATTERN.FIND_ONE, invoiceId)
      .toPromise();
  }

  async update(invoiceId: string, updateInvoiceDto: UpdateInvoiceDto): Promise<ClientInvoiceDto> {
    const updateInvoiceContract: UpdateInvoiceDto = {
      ...updateInvoiceDto,
      invoice_type: updateInvoiceDto.invoice_type
    };

    return this.invoiceClient.send<ClientInvoiceDto, ClientUpdateInvoiceDto>(
      INVOICE_PATTERN.UPDATE,
      { invoice_id: invoiceId,  ...updateInvoiceContract }
    ).toPromise();
  }

  async remove(invoiceId: string): Promise<void> {
    this.invoiceClient.send<ClientInvoiceDto>(
      INVOICE_PATTERN.REMOVE,
      invoiceId
    ).toPromise();
  }
}

