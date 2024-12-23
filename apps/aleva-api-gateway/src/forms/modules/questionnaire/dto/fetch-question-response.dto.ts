import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

// dto
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

export class FetchResponsesDto extends PageOptionsDto {
  @ApiPropertyOptional({ description: 'Query by user id' })
  @IsString()
  @IsOptional()
  user_id?: string;

  get skip(): number {
    return ((this.page ?? 1) - 1) * (this.limit ?? 10);
  }
}
