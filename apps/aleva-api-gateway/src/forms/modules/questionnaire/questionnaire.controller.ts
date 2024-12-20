import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Controller, Post, Get, Patch, Delete, Body, Param, Query, HttpCode } from '@nestjs/common';

// services
import { QuestionnaireService } from './questionnaire.service';

// dto
import { QuestionnaireDto } from './dto/questionnaire.dto';
import { CreateQuestionnaireDto } from './dto/create-questionnaire.dto';
import { UpdateQuestionnaireDto } from './dto/update-questionnaire.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

@ApiBearerAuth()
@Controller('questionnaires')
export class QuestionnaireController {
  constructor(private readonly questionnaireService: QuestionnaireService) { }

  @Post()
  @ApiOperation({ summary: 'Create Questionnaire' })
  @ApiResponse({ status: 200, description: 'Successfully fetched questionnaires.', type: QuestionnaireDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async createQuestionnaire(@Body() createQuestionnaireDto: CreateQuestionnaireDto) {
    return this.questionnaireService.create(createQuestionnaireDto);
  }

  @Get()
  @ApiOperation({ summary: 'Fetch All Questionnaire' })
  @ApiResponse({ status: 200, description: 'Successfully fetched questionnaire.', type: QuestionnaireDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    let query = await this.questionnaireService.findAll(pageOptionsDto);
    return query;
  }

  @Get("responses")
  @ApiOperation({ summary: 'Get Grouped Questionnaire Responses' })
  @ApiResponse({ status: 200, description: 'Successfully fetched grouped questionnaire responses.' })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async fetchResponses(@Query() pageOptionsDto: PageOptionsDto) {
    return await this.questionnaireService.fetchGroupedQuestionnaireData(pageOptionsDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch Single Questionnaire' })
  @ApiResponse({ status: 200, description: 'Successfully fetched questionnaire.', type: QuestionnaireDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async findOne(@Param('id') id: string) {
    let query = await this.questionnaireService.findOne(id);
    return query;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Questionnaire' })
  @ApiResponse({ status: 200, description: 'Successfully fetched questionnaire.', type: QuestionnaireDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async update(@Param('id') id: string, @Body() updateQuestionnaireDto: UpdateQuestionnaireDto) {
    let query = await this.questionnaireService.update(id, updateQuestionnaireDto);
    return query;
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete Questionnaire' })
  async remove(@Param('id') questionnaireId: string) {
    await this.questionnaireService.remove(questionnaireId);
  }
  

}