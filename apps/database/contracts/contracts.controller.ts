import { Controller, Get, Post, Put, Delete, Param, Query, Body, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ContractService } from './contracts.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('contract')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Get()
  async getAll(@Query() query) {
    return this.contractService.findAll(query);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.contractService.findOne(id);
  }

  @Post()
  async create(@Body() data) {
    return this.contractService.create(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data) {
    return this.contractService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.contractService.delete(id);
  }

  @Post(':contract_id/upload_media')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 5 }]))
  async uploadMedia(
    @Param('contract_id') contract_id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() data,
  ) {
    console.log(`Uploading media for contract ${contract_id}:`, files, data);
    return { message: 'Media uploaded successfully' };
  }
}
