import { ApiProperty } from "@nestjs/swagger";

export class PermissionDto {
    @ApiProperty({ description: 'Permission ID', example: '5c7c2807-eb62-486a-a15f-e9d7c93f5c4f' })
    permission_id: string;
  
    @ApiProperty({ description: 'Permission name', example: 'admin' })
    name: string;
  
    @ApiProperty({ description: 'Permission alias', example: 'admin' })
    alias: string;
  
    @ApiProperty({ description: 'Permission description', example: 'admin' })
    description: string;
  }
  