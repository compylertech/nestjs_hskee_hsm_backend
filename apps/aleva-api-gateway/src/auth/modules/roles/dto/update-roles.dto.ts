import { IsString, IsOptional, IsUUID, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoleDto {
  @ApiProperty({
    description: 'The name of the role',
    example: 'Super Admin',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'The alias of the role',
    example: 'super_admin',
  })
  @IsString()
  @IsOptional()
  alias?: string;

  @ApiProperty({
    description: 'The description of the role',
    example: 'Super Administrator role with all permissions',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'List of permission IDs assigned to this role',
    example: ['uuid-1', 'uuid-2'],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  permissions?: string[];
}
