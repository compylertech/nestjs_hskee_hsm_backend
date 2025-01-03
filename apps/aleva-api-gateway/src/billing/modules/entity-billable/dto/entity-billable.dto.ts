import { ApiProperty } from '@nestjs/swagger';

// enum
import { BillableTypeEnum, EntityBillableTypeEnum } from '@app/contracts';

export class EntityBillableDto {
    @ApiProperty({ description: 'Unique ID of the entity billable', example: '123e4567-e89b-12d3-a456-426614174000' })
    entity_billable_id: string;

    @ApiProperty({ description: 'Unique ID of the entity', example: '123e4567-e89b-12d3-a456-426614174000' })
    entity_id: string;

    @ApiProperty({ description: 'Type of the entity', enum: EntityBillableTypeEnum, example: EntityBillableTypeEnum.PROPERTY })
    entity_type: EntityBillableTypeEnum;

    @ApiProperty({ description: 'Unique ID of the billable item', example: '123e4567-e89b-12d3-a456-426614174000' })
    billable_id: string;

    @ApiProperty({ description: 'Type of the billable', enum: BillableTypeEnum, example: BillableTypeEnum.FIXED })
    billable_type: BillableTypeEnum;

    @ApiProperty({ description: 'Billable amount', example: 100.50 })
    billable_amount: number;

    @ApiProperty({ description: 'Apply the billable to units', example: false })
    apply_to_units: boolean;

    @ApiProperty({ description: 'Payment type ID', example: 1, nullable: true })
    payment_type_id: number | null;

    @ApiProperty({ description: 'Start period for the billable', example: '2025-01-01T00:00:00.000Z', nullable: true })
    start_period: Date | null;

    @ApiProperty({ description: 'End period for the billable', example: '2025-12-31T00:00:00.000Z', nullable: true })
    end_period: Date | null;
}
