import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from '../roles/dto/create-roles.dto';
import { UpdateRoleDto } from '../roles/dto/update-roles.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

@Injectable()
export class RolesService {
  async create(createRoleDto: CreateRoleDto) {
    return { message: 'Role created successfully', data: createRoleDto };
  }

  async findAll(pageOptionsDto: PageOptionsDto) {
    return { message: 'Roles fetched successfully', data: [], pageOptionsDto };
  }

  async findOne(id: string) {
    return { message: 'Role fetched successfully', id };
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    return { message: 'Role updated successfully', id, data: updateRoleDto };
  }

  async remove(id: string) {
    return { message: 'Role deleted successfully', id };
  }
}
