import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Controller, Post, Get, Patch, Delete, Body, Param, Query, HttpCode } from '@nestjs/common';

// services
import { [Module]Service } from './[module].service';

// dto
import { [Module]Dto } from './dto/[module].dto';
import { Create[Module]Dto } from './dto/create-[module].dto';
import { Update[Module]Dto } from './dto/update-[module].dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

@ApiBearerAuth()
@Controller('[module]es')
export class [Module]Controller {
  constructor(private readonly [module]Service: [Module]Service) { }

  @Post()
  @ApiOperation({ summary: 'Create [Module]' })
  @ApiResponse({ status: 200, description: 'Successfully fetched [module]s.', type: [Module]Dto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async create[Module](@Body() create[Module]Dto: Create[Module]Dto) {
    return this.[module]Service.create(create[Module]Dto);
  }

  @Get()
  @ApiOperation({ summary: 'Fetch All [Module]' })
  @ApiResponse({ status: 200, description: 'Successfully fetched [module].', type: [Module]Dto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    let query = await this.[module]Service.findAll(pageOptionsDto);
    return query;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch Single [Module]' })
  @ApiResponse({ status: 200, description: 'Successfully fetched [module].', type: [Module]Dto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async findOne(@Param('id') id: string) {
    let query = await this.[module]Service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update [Module]' })
  @ApiResponse({ status: 200, description: 'Successfully fetched [module].', type: [Module]Dto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async update(@Param('id') id: string, @Body() update[Module]Dto: Update[Module]Dto) {
    let query = await this.[module]Service.update(id, update[Module]Dto);
    return query;
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete [Module]' })
  async remove(@Param('id') [module]Id: string) {
    await this.[module]Service.remove([module]Id);
  }

}