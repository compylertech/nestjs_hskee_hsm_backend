import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsBoolean, IsNumber, IsOptional } from 'class-validator';

// enum
import { BillableTypeEnum, EntityBillableTypeEnum } from '@app/contracts';

export class CreateEntityBillableDto {
  @ApiProperty({ description: 'Unique ID of the entity', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  entity_id: string;

  @ApiProperty({ description: 'Type of the entity', enum: EntityBillableTypeEnum, example: EntityBillableTypeEnum.PROPERTY })
  @IsEnum(EntityBillableTypeEnum)
  @IsOptional()
  entity_type?: EntityBillableTypeEnum;

  @ApiProperty({ description: 'Unique ID of the billable item', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  billable_id: string;

  @ApiProperty({ description: 'Type of the billable', enum: BillableTypeEnum, example: BillableTypeEnum.FIXED })
  @IsEnum(BillableTypeEnum)
  billable_type: BillableTypeEnum;

  @ApiProperty({ description: 'Billable amount', example: 100.50 })
  @IsNumber()
  billable_amount: number;

  @ApiProperty({ description: 'Apply the billable to units', example: false })
  @IsBoolean()
  apply_to_units: boolean;

  @ApiProperty({ description: 'Payment type ID', example: 1, nullable: true })
  @IsOptional()
  @IsNumber()
  payment_type_id?: number;

  @ApiProperty({ description: 'Start period for the billable', example: '2025-01-01T00:00:00.000Z', nullable: true })
  @IsOptional()
  start_period?: Date;

  @ApiProperty({ description: 'End period for the billable', example: '2025-12-31T00:00:00.000Z', nullable: true })
  @IsOptional()
  end_period?: Date;
}
