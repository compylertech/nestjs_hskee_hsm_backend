import { IsArray } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

// dto
import { PageMetaDto } from './page-meta.dto';
export class PageDto<T> {
  @Expose()
  @IsArray()
  @ApiProperty({ isArray: true })
  readonly data: T[];

  @Expose()
  @ApiProperty({ type: () => PageMetaDto })
  readonly meta: PageMetaDto;

  constructor(data: T[], meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
