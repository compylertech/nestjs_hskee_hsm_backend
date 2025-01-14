import { ApiProperty } from '@nestjs/swagger';

export class PermissionDto {
  @ApiProperty({ description: 'Unique identifier of the permission', example: 'e1c3a1d2-567b-4ae3-bbde-8fa6e56a2f48' })
  permission_id: string;

  @ApiProperty({ description: 'Name of the permission', example: 'manage_users' })
  name: string;

  @ApiProperty({ description: 'Alias for the permission', example: 'Manage Users' })
  alias: string;

  @ApiProperty({ description: 'Description of the permission', example: 'Grants the ability to manage user accounts' })
  description: string;
}
