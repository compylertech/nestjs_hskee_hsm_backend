import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

// contracts
import { CreateUserDto, UpdateUserDto, USERS_PATTERNS } from '@app/contracts';

// dto
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

// services
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @MessagePattern(USERS_PATTERNS.CREATE)
  async create(@Payload() payload: { createUserDto: CreateUserDto; tag?: string }) {
    try {
      const { createUserDto, tag = null } = payload;
      
      return await this.usersService.create(createUserDto, tag ? tag : null);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || 'Error creating user!',
      });
    }
  }

  @MessagePattern(USERS_PATTERNS.FIND_ALL)
  async findAll(@Payload() pageOptionsDto: PageOptionsDto) {
    try {
      return await this.usersService.findAll(pageOptionsDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || 'Error fetching users!',
      });
    }
  }

  @MessagePattern(USERS_PATTERNS.FIND_ONE)
  async findOne(@Payload() id: string) {
    try {
      return await this.usersService.findOne(id);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || `Error fetching User with id: ${id}`,
      });
    }
  }

  @MessagePattern(USERS_PATTERNS.UPDATE)
  async update(@Payload() updateUserDto: UpdateUserDto) {
    try {
      return await this.usersService.update(updateUserDto.user_id, updateUserDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || `Error updating User with id: ${updateUserDto.user_id}`,
      });
    }
  }

  @MessagePattern(USERS_PATTERNS.DELETE)
  async remove(@Payload() id: string) {
    try {
      await this.usersService.remove(id);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message,
      });
    }
  }

  @MessagePattern(USERS_PATTERNS.FIND_ONE_EMAIL)
  async findUserByEMail(@Payload() email: string) {
    return await this.usersService.findUserByEmail(email);
  }

  @MessagePattern(USERS_PATTERNS.FETCH_RELATION_USERS)
  async fetchRelatedUsers(@Payload() userIds: string []) {
    return await this.usersService.findByUserIds(userIds);
  }
}