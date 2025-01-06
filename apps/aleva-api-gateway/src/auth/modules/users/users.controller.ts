import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Query, BadRequestException } from '@nestjs/common';

// services
import { UsersService } from './users.service';

// dto
import { UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

// contracts
import { OnboardingMailDto, WelcomeMailDto } from '@app/contracts';

// pipes
import { transformUserToDto } from './pipes/user-transform.pipe';
import { UserQueryPageOptionDto } from './page-options/page-query.dto';
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) { }

  @Post()
@ApiOperation({ summary: 'Create User' })
@ApiResponse({ status: 200, description: 'Successfully fetched users.', type: UserDto })
@ApiResponse({ status: 422, description: 'Validation Error' })
async create(@Body() createUserDto: CreateUserDto) {
  try {
    const query = await this.usersService.create(createUserDto);
    console.log(`query: ${JSON.stringify(query)}`);

    // Check if query indicates failure
    if (!query.user_id) {
      throw new BadRequestException(`Sign Up Failed: ${query["error"] || 'Unknown error'}`);
    }

    // Send welcome email if user creation succeeded
    if (query) {
      await this.usersService.sendWelcomeEmail({
        first_name: query.first_name,
        last_name: query.last_name,
        user_email: query.email,
        unsubscribe_link: '',
      } as WelcomeMailDto);
    }

    // Transform and return the created user
    return transformUserToDto(query);
  } catch (error) {
    console.error('Error during user creation:', error);
    throw new BadRequestException('Sign Up Failed: ' + error.message);
  }
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

  @Get('/onboarding/:id')
  @ApiOperation({ summary: 'Send onboarding email' })
  @ApiResponse({ status: 200, description: 'Successfully sent email.' })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async sendOnboardingEmail(@Param('id') id: string) {
    let query = await this.usersService.findOne(id);
    let qr_code = query.media.filter((item) => item.media_name == "qr_code")
    console.log(`qr_code: ${JSON.stringify(query.media["media"])}`)

    try {
      if (query) {
        await this.usersService.sendQrCodeEmail({
          first_name: query.first_name,
          last_name: query.last_name,
          user_email: query.email,
          qr_code: '',
          unsubscribe_link: ''
        } as OnboardingMailDto)
      }
    } catch (error) {
      return {
        message: "Error sending email"
      }
    }

    return {
      message: "Email Sent"
    }
  }
}
