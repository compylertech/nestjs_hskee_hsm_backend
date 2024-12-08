import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

// constants
import { RBAC_CLIENT } from '../common/utils/constants';

// contracts
import {
  USERS_PATTERNS,
  UserDto as ClientUserDto,
  CreateUserDto as ClientCreateUserDto,
  UpdateUserDto as ClientUpdateUserDto,
} from '@app/contracts';


// dto
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

// pipes
import { transformGatewayUserDto } from './pipes/user-transform.pipe';

@Injectable()
export class UsersService {
  constructor(@Inject(RBAC_CLIENT) private rbacClient: ClientProxy) { }

  create(createUserDto: CreateUserDto) {
    const transformedDto = transformGatewayUserDto(createUserDto);
    return this.rbacClient
      .send<ClientUserDto, ClientCreateUserDto>(
        USERS_PATTERNS.CREATE, transformedDto
      ).toPromise();
  }

  findAll(pageOptionsDto: PageOptionsDto) {
    return this.rbacClient.send<ClientUserDto[]>(
      USERS_PATTERNS.FIND_ALL,
      pageOptionsDto,
    ).toPromise();
  }

  findOne(id: string) {
    return this.rbacClient.send<ClientUserDto>(
      USERS_PATTERNS.FIND_ONE,
      id
    ).toPromise();
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const transformedDto = transformGatewayUserDto(updateUserDto);

    return this.rbacClient.send<ClientUserDto, ClientUpdateUserDto>(
      USERS_PATTERNS.UPDATE,
      { user_id: id, ...transformedDto }
    ).toPromise();
  }

  remove(id: string) {
    return this.rbacClient.send<ClientUserDto>(
      USERS_PATTERNS.REMOVE,
      id
    ).toPromise();;
  }
}
