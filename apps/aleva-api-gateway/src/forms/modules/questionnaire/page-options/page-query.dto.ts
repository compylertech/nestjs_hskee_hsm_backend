import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

// dto
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

export class QuestionniareQueryPageOptionDto extends PageOptionsDto {
  @ApiPropertyOptional({ description: 'Questionnaire tag' })
  @IsString()
  @IsOptional()
  tag?: string;

  get skip(): number {
    return ((this.page ?? 1) - 1) * (this.limit ?? 10);
  }
}
