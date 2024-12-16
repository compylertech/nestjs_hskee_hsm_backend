import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// entity
import { Invoice, InvoiceItem } from './entities/invoice.entity';

// services
import { InvoiceService } from './invoice.service';

// controllers
import { InvoiceController } from './invoice.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice, InvoiceItem])],
  controllers: [InvoiceController],
  providers: [InvoiceService],
})
export class InvoiceModule {}
