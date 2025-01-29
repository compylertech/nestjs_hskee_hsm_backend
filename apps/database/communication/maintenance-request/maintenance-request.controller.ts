import { Controller, Get, Post, Put, Delete, Param, Query, Body } from '@nestjs/common';
import { MaintenanceRequestService } from './maintenance-request.service';

@Controller('maintenance-request')
export class MaintenanceRequestController {
  constructor(private readonly maintenanceRequestService: MaintenanceRequestService) {}

  @Get()
  async getAll(@Query() query) {
    return this.maintenanceRequestService.findAll(query);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.maintenanceRequestService.findOne(id);
  }

  @Post()
  async create(@Body() data) {
    return this.maintenanceRequestService.create(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data) {
    return this.maintenanceRequestService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.maintenanceRequestService.delete(id);
  }
}
