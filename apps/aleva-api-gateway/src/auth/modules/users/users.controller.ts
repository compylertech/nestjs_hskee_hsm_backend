import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Query, BadRequestException } from '@nestjs/common';

// services
import { UsersService } from './users.service';
import { MailService } from '@app/modules/messaging/src/mail/mail.service';

// dto
import { UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

// pipes
import { transformUserToDto } from './pipes/user-transform.pipe';
import { UserQueryPageOptionDto } from './page-options/page-query.dto';
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailService: MailService
  ) { }

  @Post()
  @ApiOperation({ summary: 'Create User' })
  @ApiResponse({ status: 200, description: 'Successfully fetched users.', type: UserDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async create(@Body() createUserDto: CreateUserDto) {
    let query = await this.usersService.create(createUserDto);

    // if (query) {
    //   this.mailService.sendOnboardingMail()
    // }
    return transformUserToDto(query);
  }

  @Get()
  @ApiOperation({ summary: 'Fetch All Users' })
  @ApiResponse({ status: 200, description: 'Successfully fetched users.', type: UserDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async findAll(@Query() pageOptionsDto: UserQueryPageOptionDto) {
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

    try {

      if (updateUserDto.answers && Array.isArray(updateUserDto.answers)) {
        updateUserDto.answers = updateUserDto.answers.map((answer) => {
          return {
            ...answer,
            entity_id: answer.entity_id || id,
          } 
        });
      }

      let usersQueryResponse = await this.usersService.update(id, updateUserDto);
      
      return transformUserToDto(usersQueryResponse);

    } catch (error) {
      throw new BadRequestException('Validation failed: ' + error.message);
    }
  }


  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete User' })
  async remove(@Param('id') id: string) {
    await this.usersService.remove(id);
  }
}
