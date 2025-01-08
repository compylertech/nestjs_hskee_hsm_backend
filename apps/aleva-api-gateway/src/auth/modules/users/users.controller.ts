import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Query, BadRequestException } from '@nestjs/common';

// services
import { UsersService } from './users.service';

// dto
import { UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

// contracts
import { OnboardingMailDto, UserDto as UserContractDto, WelcomeMailDto } from '@app/contracts';

// pipes
import { transformUserToDto } from './pipes/user-transform.pipe';
import { UserOnboardingPageOptionDto, UserQueryPageOptionDto } from './page-options/page-query.dto';
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
  async create(@Body() createUserDto: CreateUserDto, @Query() tagDto: UserOnboardingPageOptionDto) {
    try {
      const existingUser = await this.usersService.findByEmail(createUserDto.email);

      if (existingUser && existingUser["data"]) {
        return existingUser;
      }

      // create a new user
      const query = await this.usersService.create(createUserDto, tagDto.tag as string);

      try {
        // send onboarding mail 
        if (tagDto.tag as string == "onboarding") {
          await this.usersService.sendWelcomeEmail({
            first_name: query.first_name,
            last_name: query.last_name,
            email: query.email,
            user_id: query.user_id
          } as WelcomeMailDto);

        }
      } catch (error) {
        return {
          message: "Error sending email"
        }
      }

      // transform and return the created user
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

    try {
      await this.sendOnboardingMail(query);
    } catch (error) {
      return {
        message: "Error sending email"
      }
    }

    return {
      message: "Email Sent"
    }
  }

  private async sendOnboardingMail(query: UserContractDto) {
    if (query) {
      const targetMedia = query.media.find(mediaItem => mediaItem.media_name === "aleva_qr");
      const contentUrl = targetMedia?.content_url;

      await this.usersService.sendQrCodeEmail({
        first_name: query.first_name,
        last_name: query.last_name,
        email: query.email,
        qr_code: `${contentUrl}`,
        unsubscribe_link: ''
      } as OnboardingMailDto);
    }
  }
}
