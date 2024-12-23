import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Controller, Post, Get, Patch, Delete, Body, Param, Query, HttpCode } from '@nestjs/common';

// services
import { MediaService } from './media.service';

// dto
import { MediaDto } from './dto/media.dto';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

@ApiBearerAuth()
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) { }

  @Post()
  @ApiOperation({ summary: 'Create Media' })
  @ApiResponse({ status: 200, description: 'Successfully fetched medias.', type: MediaDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async createMedia(@Body() createMediaDto: CreateMediaDto) {
    return this.mediaService.create(createMediaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Fetch All Media' })
  @ApiResponse({ status: 200, description: 'Successfully fetched media.', type: MediaDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    let query = await this.mediaService.findAll(pageOptionsDto);
    return query;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch Single Media' })
  @ApiResponse({ status: 200, description: 'Successfully fetched media.', type: MediaDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async findOne(@Param('id') id: string) {
    let query = await this.mediaService.findOne(id);
    return query;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Media' })
  @ApiResponse({ status: 200, description: 'Successfully fetched media.', type: MediaDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async update(@Param('id') id: string, @Body() updateMediaDto: UpdateMediaDto) {
    let query = await this.mediaService.update(id, updateMediaDto);
    return query;
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete Media' })
  async remove(@Param('id') mediaId: string) {
    await this.mediaService.remove(mediaId);
  }

}