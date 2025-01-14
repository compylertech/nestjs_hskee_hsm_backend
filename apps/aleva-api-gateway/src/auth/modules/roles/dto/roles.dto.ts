import { ApiProperty } from '@nestjs/swagger';
import { Permission } from '../../../../../../resources/entities/permission.entity';
import { User } from '../../../../../../resources/entities/user.entity';

export class RoleDto {
  @ApiProperty({
    description: 'The unique identifier of the role',
    example: '6c3720e1-49f6-4b9a-9c2e-d14e35f8f0ed',
  })
  role_id: string;

  @ApiProperty({
    description: 'The name of the role',
    example: 'Admin',
  })
  name: string;

  @ApiProperty({
    description: 'The alias of the role',
    example: 'admin',
  })
  alias: string;

  @ApiProperty({
    description: 'The description of the role',
    example: 'Administrator role with full permissions',
  })
  description: string;

  @ApiProperty({
    description: 'The list of permissions assigned to the role',
    type: [Permission],
  })
  permissions: Permission[];

  @ApiProperty({
    description: 'The list of users assigned to the role',
    type: [User],
  })
  users: User[];
}
