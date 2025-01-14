import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permissions.dto';
import { UpdatePermissionDto } from './dto/update-permissions.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

@Injectable()
export class PermissionsService {
  async create(createPermissionDto: CreatePermissionDto) {
    return { message: 'Permission created successfully', data: createPermissionDto };
  }

  async findAll(pageOptionsDto: PageOptionsDto) {
    return { message: 'Permissions fetched successfully', data: [], pageOptionsDto };
  }

  async findOne(id: string) {
    return { message: 'Permission fetched successfully', id };
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto) {
    return { message: 'Permission updated successfully', id, data: updatePermissionDto };
  }

  async remove(id: string) {
    return { message: 'Permission deleted successfully', id };
  }
}
