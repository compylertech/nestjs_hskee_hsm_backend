import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';

// services
import { RolesService } from './roles.service';

// dto
import { CreateRoleDto } from '../roles/dto/create-roles.dto';
import { UpdateRoleDto } from '../roles/dto/update-roles.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new role' })
  @ApiBody({ type: CreateRoleDto })
  async create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all roles with pagination' })
  @ApiQuery({ type: PageOptionsDto })
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    return this.rolesService.findAll(pageOptionsDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific role by ID' })
  @ApiParam({ name: 'id', description: 'Unique identifier of the role' })
  async findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a role' })
  @ApiParam({ name: 'id', description: 'Unique identifier of the role to update' })
  @ApiBody({ type: UpdateRoleDto })
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a role' })
  @ApiParam({ name: 'id', description: 'Unique identifier of the role to delete' })
  async remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }
}
