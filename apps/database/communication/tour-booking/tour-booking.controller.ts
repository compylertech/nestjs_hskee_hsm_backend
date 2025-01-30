import { Controller, Get, Post, Put, Delete, Param, Query, Body } from '@nestjs/common';
import { TourBookingService } from './tour-booking.service';

@Controller('tour')
export class TourBookingController {
  constructor(private readonly tourBookingService: TourBookingService) {}

  @Get()
  async getAll(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @Query('user_id') user_id: string,
    @Query('email') email: string,
    @Query('name') name: string,
    @Query('phone_number') phone_number: string,
    @Query('status') status: string,
    @Query('tour_type') tour_type: string,
    @Query('date_gte') date_gte: string,
    @Query('date_lte') date_lte: string,
  ) {
    return this.tourBookingService.findAll({ user_id, email, name, phone_number, status, tour_type, date_gte, date_lte });
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.tourBookingService.findOne(id);
  }

  @Post()
  async create(@Body() data) {
    return this.tourBookingService.create(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data) {
    return this.tourBookingService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.tourBookingService.delete(id);
  }
}
