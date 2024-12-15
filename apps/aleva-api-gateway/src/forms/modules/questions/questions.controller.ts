import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Controller, Post, Get, Patch, Delete, Body, Param, Query, HttpCode } from '@nestjs/common';

// services
import { QuestionsService } from './questions.service';

// dto
import { QuestionDto } from './dto/question.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

@ApiBearerAuth()
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) { }

  @Post()
  @ApiOperation({ summary: 'Create Questions' })
  @ApiResponse({ status: 200, description: 'Successfully fetched questionss.', type: QuestionDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async createQuestions(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionsService.create(createQuestionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Fetch All Questions' })
  @ApiResponse({ status: 200, description: 'Successfully fetched questions.', type: QuestionDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    let query = await this.questionsService.findAll(pageOptionsDto);
    return query;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch Single Questions' })
  @ApiResponse({ status: 200, description: 'Successfully fetched questions.', type: QuestionDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async findOne(@Param('id') id: string) {
    let query = await this.questionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Questions' })
  @ApiResponse({ status: 200, description: 'Successfully fetched questions.', type: QuestionDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async update(@Param('id') id: string, @Body() updateQuestionDto: UpdateQuestionDto) {
    let query = await this.questionsService.update(id, updateQuestionDto);
    return query;
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete Questions' })
  async remove(@Param('id') questionsId: string) {
    await this.questionsService.remove(questionsId);
  }

}