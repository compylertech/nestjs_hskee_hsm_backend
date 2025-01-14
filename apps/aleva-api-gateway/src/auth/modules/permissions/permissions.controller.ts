import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Controller, Post, Get, Patch, Delete, Body, Param, Query, HttpCode } from '@nestjs/common';

// services
import { PermissionsService } from '../permissions/permissions.service';

// dto
import { PermissionDto } from '../permissions/dto/permissions.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';
import { CreatePermissionDto } from './dto/create-permissions.dto';
import { UpdatePermissionDto } from '../permissions/dto/update-permissions.dto';

@ApiBearerAuth()
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create Permission' })
  @ApiResponse({ status: 200, description: 'Permission created successfully.', type: PermissionDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Fetch All Permissions' })
  @ApiResponse({ status: 200, description: 'Successfully fetched permissions.', type: [PermissionDto] })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    return this.permissionsService.findAll(pageOptionsDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch Single Permission' })
  @ApiResponse({ status: 200, description: 'Successfully fetched the permission.', type: PermissionDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Permission' })
  @ApiResponse({ status: 200, description: 'Permission updated successfully.', type: PermissionDto })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
    return this.permissionsService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete Permission' })
  @ApiResponse({ status: 204, description: 'Permission deleted successfully.' })
  async remove(@Param('id') permissionId: string) {
    await this.permissionsService.remove(permissionId);
  }
}
