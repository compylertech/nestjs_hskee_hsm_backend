import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Controller, Post, Get, Patch, Delete, Body, Param, Query, HttpCode } from '@nestjs/common';

// services
import { AddressService } from './address.service';

// dto
import { AddressDto } from './dto/address.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

@ApiBearerAuth()
@Controller('addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) { }

  @Post()
  @ApiOperation({ summary: 'Create Address' })
  @ApiResponse({ status: 200, description: 'Successfully fetched addresss.', type: AddressDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async createAddress(@Body() createAddressDto: CreateAddressDto) {
    return this.addressService.create(createAddressDto);
  }

  @Get()
  @ApiOperation({ summary: 'Fetch All Address' })
  @ApiResponse({ status: 200, description: 'Successfully fetched address.', type: AddressDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    let query = await this.addressService.findAll(pageOptionsDto);
    return query;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch Single Address' })
  @ApiResponse({ status: 200, description: 'Successfully fetched address.', type: AddressDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async findOne(@Param('id') id: string) {
    let query = await this.addressService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Address' })
  @ApiResponse({ status: 200, description: 'Successfully fetched address.', type: AddressDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
    let query = await this.addressService.update(id, updateAddressDto);
    return query;
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete Address' })
  async remove(@Param('id') addressId: string) {
    await this.addressService.remove(addressId);
  }

}