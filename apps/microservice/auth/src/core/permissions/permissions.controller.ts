import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { PermissionsService } from '../../../../../aleva-api-gateway/src/auth/modules/permissions/permissions.service';
import { CreatePermissionDto } from '../../../../../aleva-api-gateway/src/auth/modules/permissions/dto/create-permissions.dto';
import { UpdatePermissionDto } from '../../../../../aleva-api-gateway/src/auth/modules/permissions/dto/update-permissions.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  @Get()
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    return this.permissionsService.findAll(pageOptionsDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
    return this.permissionsService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.permissionsService.remove(id);
  }
}