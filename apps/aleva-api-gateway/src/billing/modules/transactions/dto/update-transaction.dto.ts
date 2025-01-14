import { PartialType } from '@nestjs/swagger';
import { CreateTransactionsDto } from '.././dto/create-transaction.dto';


export class UpdateTransactionsDto extends PartialType(CreateTransactionsDto) {}
