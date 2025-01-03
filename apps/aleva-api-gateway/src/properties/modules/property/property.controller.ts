import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Controller, Post, Get, Patch, Delete, Body, Param, Query, HttpCode } from '@nestjs/common';

// services
import { PropertyService } from './property.service';

// dto
import { PropertyDto } from './dto/property.dto';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

@ApiBearerAuth()
@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) { }

  @Post()
  @ApiOperation({ summary: 'Create Property' })
  @ApiResponse({ status: 200, description: 'Successfully fetched properties.', type: PropertyDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async createProperty(@Body() createPropertyDto: CreatePropertyDto) {
    return this.propertyService.create(createPropertyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Fetch All Property' })
  @ApiResponse({ status: 200, description: 'Successfully fetched property.', type: PropertyDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    let query = await this.propertyService.findAll(pageOptionsDto);
    return query;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch Single Property' })
  @ApiResponse({ status: 200, description: 'Successfully fetched property.', type: PropertyDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async findOne(@Param('id') id: string) {
    let query = await this.propertyService.findOne(id);
    return query;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Property' })
  @ApiResponse({ status: 200, description: 'Successfully fetched property.', type: PropertyDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async update(@Param('id') id: string, @Body() updatePropertyDto: UpdatePropertyDto) {
    let query = await this.propertyService.update(id, updatePropertyDto);
    return query;
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete Property' })
  async remove(@Param('id') propertyId: string) {
    await this.propertyService.remove(propertyId);
  }

}