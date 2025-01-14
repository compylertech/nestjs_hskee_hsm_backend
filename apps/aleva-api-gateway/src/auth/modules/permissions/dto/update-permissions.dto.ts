import {
    IsUUID,
    IsString,
    IsOptional,
  } from 'class-validator';
  import { ApiProperty } from '@nestjs/swagger';
  
  export class UpdatePermissionDto {
    @ApiProperty({
      description: 'The unique identifier of the permission',
      example: '0d394844-4df0-4337-8dfc-ff79cc15be17',
    })
    @IsOptional()
    @IsUUID()
    permission_id?: string;
  
    @ApiProperty({
      description: 'The name of the permission',
      example: 'Manage Users',
    })
    @IsOptional()
    @IsString()
    name?: string;
  
    @ApiProperty({
      description: 'The alias of the permission',
      example: 'manage_users',
    })
    @IsOptional()
    @IsString()
    alias?: string;
  
    @ApiProperty({
      description: 'The description of the permission',
      example: 'Allows the user to manage other users.',
    })
    @IsOptional()
    @IsString()
    description?: string;
  }
  