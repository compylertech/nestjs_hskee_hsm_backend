import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Controller, Post, Get, Patch, Delete, Body, Param, Query, HttpCode } from '@nestjs/common';

// services
import { RentalHistoryService } from './rental-history.service';

// dto
import { RentalHistoryDto } from './dto/rental-history.dto';
import { CreateRentalHistoryDto } from './dto/create-rental-history.dto';
import { UpdateRentalHistoryDto } from './dto/update-rental-history.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

@ApiBearerAuth()
@Controller('rentalHistoryes')
export class RentalHistoryController {
  constructor(private readonly rentalHistoryService: RentalHistoryService) { }

  @Post()
  @ApiOperation({ summary: 'Create RentalHistory' })
  @ApiResponse({ status: 200, description: 'Successfully fetched rentalHistorys.', type: RentalHistoryDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async createRentalHistory(@Body() createRentalHistoryDto: CreateRentalHistoryDto) {
    return this.rentalHistoryService.create(createRentalHistoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Fetch All RentalHistory' })
  @ApiResponse({ status: 200, description: 'Successfully fetched rentalHistory.', type: RentalHistoryDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    let query = await this.rentalHistoryService.findAll(pageOptionsDto);
    return query;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch Single RentalHistory' })
  @ApiResponse({ status: 200, description: 'Successfully fetched rentalHistory.', type: RentalHistoryDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async findOne(@Param('id') id: string) {
    let query = await this.rentalHistoryService.findOne(id);
    return query;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update RentalHistory' })
  @ApiResponse({ status: 200, description: 'Successfully fetched rentalHistory.', type: RentalHistoryDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async update(@Param('id') id: string, @Body() updateRentalHistoryDto: UpdateRentalHistoryDto) {
    let query = await this.rentalHistoryService.update(id, updateRentalHistoryDto);
    return query;
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete RentalHistory' })
  async remove(@Param('id') rentalHistoryId: string) {
    await this.rentalHistoryService.remove(rentalHistoryId);
  }

}