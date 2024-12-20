import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Query } from '@nestjs/common';

// services
import { UsersService } from './users.service';

// dto
import { UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

// pipes
import { transformUserToDto } from './pipes/user-transform.pipe';
import { QuestionnaireService } from 'apps/aleva-api-gateway/src/forms/modules/questionnaire/questionnaire.service';

@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly questionnaireService: QuestionnaireService,
  ) { }

  @Post()
  @ApiOperation({ summary: 'Create User' })
  @ApiResponse({ status: 200, description: 'Successfully fetched users.', type: UserDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async create(@Body() createUserDto: CreateUserDto) {
    let query = await this.usersService.create(createUserDto);
    return transformUserToDto(query);
  }

  @Get()
  @ApiOperation({ summary: 'Fetch All Users' })
  @ApiResponse({ status: 200, description: 'Successfully fetched users.', type: UserDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    let query = await this.usersService.findAll(pageOptionsDto);
    query["data"] = query["data"].map((user) => transformUserToDto(user))
    return query;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch Single User' })
  @ApiResponse({ status: 200, description: 'Successfully fetched users.', type: UserDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async findOne(@Param('id') id: string) {
    let query = await this.usersService.findOne(id);
    return transformUserToDto(query);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update User' })
  @ApiResponse({ status: 200, description: 'Successfully fetched users.', type: UserDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    let query = await this.usersService.update(id, updateUserDto);
    let usersQueryResponse = transformUserToDto(query);

    if (updateUserDto.answers && Array.isArray(updateUserDto.answers)) {
      updateUserDto.answers = updateUserDto.answers.map((answer) => {
        return {
          ...answer,
          entity_id: answer.entity_id || id,
        };
      });
    }

    let t = await this.questionnaireService.createEntityQuestionnaire(updateUserDto.answers[0]);

    return t;
  }


  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete User' })
  async remove(@Param('id') id: string) {
    await this.usersService.remove(id);
  }
}
