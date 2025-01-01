import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Controller, Post, Get, Patch, Delete, Body, Param, Query, HttpCode } from '@nestjs/common';

// services
import { AmenitiesService } from './amenities.service';

// dto
import { AmenitiesDto } from './dto/amenities.dto';
import { CreateAmenitiesDto } from './dto/create-amenities.dto';
import { UpdateAmenitiesDto } from './dto/update-amenities.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

@ApiBearerAuth()
@Controller('amenities')
export class AmenitiesController {
  constructor(private readonly amenitiesService: AmenitiesService) { }

  @Post()
  @ApiOperation({ summary: 'Create Amenities' })
  @ApiResponse({ status: 200, description: 'Successfully fetched amenitiess.', type: AmenitiesDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async createAmenities(@Body() createAmenitiesDto: CreateAmenitiesDto) {
    return this.amenitiesService.create(createAmenitiesDto);
  }

  @Get()
  @ApiOperation({ summary: 'Fetch All Amenities' })
  @ApiResponse({ status: 200, description: 'Successfully fetched amenities.', type: AmenitiesDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    let query = await this.amenitiesService.findAll(pageOptionsDto);
    return query;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch Single Amenities' })
  @ApiResponse({ status: 200, description: 'Successfully fetched amenities.', type: AmenitiesDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async findOne(@Param('id') id: string) {
    let query = await this.amenitiesService.findOne(id);
    return query;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Amenities' })
  @ApiResponse({ status: 200, description: 'Successfully fetched amenities.', type: AmenitiesDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async update(@Param('id') id: string, @Body() updateAmenitiesDto: UpdateAmenitiesDto) {
    let query = await this.amenitiesService.update(id, updateAmenitiesDto);
    return query;
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete Amenities' })
  async remove(@Param('id') amenitiesId: string) {
    await this.amenitiesService.remove(amenitiesId);
  }

}