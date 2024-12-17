import { ApiProperty } from '@nestjs/swagger';
import { PermissionDto } from './permission.dto';

export class RoleDto {
  @ApiProperty({ description: 'Role ID', example: 'd2da7991-5ada-41c4-822e-403132ca49e7' })
  role_id: string;

  @ApiProperty({ description: 'Role name', example: 'landlord' })
  name: string;

  @ApiProperty({ description: 'Role alias', example: 'landlord' })
  alias: string;

  @ApiProperty({ description: 'Role description', example: 'landlord' })
  description: string;

  @ApiProperty({ description: 'Role permissions', type: [PermissionDto] })
  permissions: PermissionDto[];
}
