import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

// constants
import { USERS_CLIENT } from '../constants';

// dto
import { CreateUserDto } from './dto/create-auth.dto';
import { UpdateUserDto } from './dto/update-auth.dto';


@Injectable()
export class UsersService {
  constructor(@Inject(USERS_CLIENT) private formsClient: ClientProxy) { }

  create(createAuthDto: CreateUserDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateUserDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
