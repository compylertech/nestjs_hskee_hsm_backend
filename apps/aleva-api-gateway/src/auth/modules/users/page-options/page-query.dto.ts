import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

// dto
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

export class UserQueryPageOptionDto extends PageOptionsDto {
  @ApiPropertyOptional({ description: 'User type of a user' })
  @IsString()
  @IsOptional()
  user_status?: string;

  get skip(): number {
    return ((this.page ?? 1) - 1) * (this.limit ?? 10);
  }
}
