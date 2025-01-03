import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsString, IsBoolean, IsNumber, IsOptional } from 'class-validator';

// enum
import { BillableTypeEnum, EntityBillableTypeEnum } from '@app/contracts';

export class UpdateEntityBillableDto {
  @ApiPropertyOptional({ description: 'Unique ID of the entity billable', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  @IsOptional()
  entity_billable_id?: string;

  @ApiPropertyOptional({ description: 'Unique ID of the entity', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  @IsOptional()
  entity_id?: string;

  @ApiPropertyOptional({ description: 'Type of the entity', enum: EntityBillableTypeEnum, example: EntityBillableTypeEnum.PROPERTY })
  @IsEnum(EntityBillableTypeEnum)
  @IsOptional()
  entity_type?: EntityBillableTypeEnum;

  @ApiPropertyOptional({ description: 'Unique ID of the billable item', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  @IsOptional()
  billable_id?: string;

  @ApiPropertyOptional({ description: 'Type of the billable', enum: BillableTypeEnum, example: BillableTypeEnum.FIXED })
  @IsEnum(BillableTypeEnum)
  @IsOptional()
  billable_type?: BillableTypeEnum;

  @ApiPropertyOptional({ description: 'Billable amount', example: 100.50 })
  @IsNumber()
  @IsOptional()
  billable_amount?: number;

  @ApiPropertyOptional({ description: 'Apply the billable to units', example: false })
  @IsBoolean()
  @IsOptional()
  apply_to_units?: boolean;

  @ApiPropertyOptional({ description: 'Payment type ID', example: 1, nullable: true })
  @IsOptional()
  @IsNumber()
  payment_type_id?: number;

  @ApiPropertyOptional({ description: 'Start period for the billable', example: '2025-01-01T00:00:00.000Z', nullable: true })
  @IsOptional()
  start_period?: Date;

  @ApiPropertyOptional({ description: 'End period for the billable', example: '2025-12-31T00:00:00.000Z', nullable: true })
  @IsOptional()
  end_period?: Date;
}
