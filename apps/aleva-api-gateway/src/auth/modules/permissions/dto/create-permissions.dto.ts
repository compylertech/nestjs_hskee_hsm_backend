import { ApiProperty } from '@nestjs/swagger';

export class CreatePermissionDto {
  @ApiProperty({ description: 'Name of the permission', example: 'manage_users' })
  name: string;

  @ApiProperty({ description: 'Alias for the permission', example: 'Manage Users' })
  alias: string;

  @ApiProperty({ description: 'Description of the permission', example: 'Grants the ability to manage user accounts' })
  description: string;
}
