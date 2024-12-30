import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Controller, Post, Get, Patch, Delete, Body, Param, Query, HttpCode } from '@nestjs/common';

// services
import { UnitService } from './unit.service';

// dto
import { UnitDto } from './dto/unit.dto';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

@ApiBearerAuth()
@Controller('unites')
export class UnitController {
  constructor(private readonly unitService: UnitService) { }

  @Post()
  @ApiOperation({ summary: 'Create Unit' })
  @ApiResponse({ status: 200, description: 'Successfully fetched units.', type: UnitDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async createUnit(@Body() createUnitDto: CreateUnitDto) {
    return this.unitService.create(createUnitDto);
  }

  @Get()
  @ApiOperation({ summary: 'Fetch All Unit' })
  @ApiResponse({ status: 200, description: 'Successfully fetched unit.', type: UnitDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    let query = await this.unitService.findAll(pageOptionsDto);
    return query;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch Single Unit' })
  @ApiResponse({ status: 200, description: 'Successfully fetched unit.', type: UnitDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async findOne(@Param('id') id: string) {
    let query = await this.unitService.findOne(id);
    return query;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Unit' })
  @ApiResponse({ status: 200, description: 'Successfully fetched unit.', type: UnitDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async update(@Param('id') id: string, @Body() updateUnitDto: UpdateUnitDto) {
    let query = await this.unitService.update(id, updateUnitDto);
    return query;
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete Unit' })
  async remove(@Param('id') unitId: string) {
    await this.unitService.remove(unitId);
  }

}