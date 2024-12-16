import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Controller, Post, Get, Patch, Delete, Body, Param, Query, HttpCode } from '@nestjs/common';

// services
import { AnswerService } from './answers.service';

// dto
import { AnswerDto } from './dto/answer.dto';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

@ApiBearerAuth()
@Controller('answers')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) { }

  @Post()
  @ApiOperation({ summary: 'Create Answer' })
  @ApiResponse({ status: 200, description: 'Successfully fetched answers.', type: AnswerDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async createAnswer(@Body() createAnswerDto: CreateAnswerDto) {
    return this.answerService.create(createAnswerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Fetch All Answer' })
  @ApiResponse({ status: 200, description: 'Successfully fetched answer.', type: AnswerDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    let query = await this.answerService.findAll(pageOptionsDto);
    return query;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch Single Answer' })
  @ApiResponse({ status: 200, description: 'Successfully fetched answer.', type: AnswerDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async findOne(@Param('id') id: string) {
    let query = await this.answerService.findOne(id);
    return query;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Answer' })
  @ApiResponse({ status: 200, description: 'Successfully fetched answer.', type: AnswerDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async update(@Param('id') id: string, @Body() updateAnswerDto: UpdateAnswerDto) {
    let query = await this.answerService.update(id, updateAnswerDto);
    return query;
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete Answer' })
  async remove(@Param('id') answerId: string) {
    await this.answerService.remove(answerId);
  }

}