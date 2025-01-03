import { BillableTypeEnum, EntityBillableTypeEnum } from "./entity-billable.enum";

export class CreateEntityBillableDto {
    entity_id: string;
    entity_type?: EntityBillableTypeEnum;
    billable_id: string;
    billable_type: BillableTypeEnum;
    billable_amount: number;
    apply_to_units: boolean;
    payment_type_id?: number;
    start_period?: Date;
    end_period?: Date;

    static keys(): string[] {
        return [
            'billable_id', 'billable_type', 'billable_amount', 
            'apply_to_units', 'payment_type_id', 'start_period', 'end_period'
        ];
    }
}