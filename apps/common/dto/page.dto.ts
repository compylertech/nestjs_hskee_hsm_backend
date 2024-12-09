import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { PageMetaDto } from './page-meta.dto';
import { Expose } from 'class-transformer';

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
