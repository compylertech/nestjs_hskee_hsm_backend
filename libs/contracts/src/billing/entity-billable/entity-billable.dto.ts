import { BillableTypeEnum, EntityBillableTypeEnum } from "./entity-billable.enum";

export class EntityBillableDto {
    entity_billable_id: string;
    entity_id: string;
    entity_type: EntityBillableTypeEnum | null;
    billable_id: string;
    billable_type: BillableTypeEnum;
    billable_amount: number;
    apply_to_units: boolean;
    payment_type_id?: number;
    start_period?: Date;
    end_period?: Date;
}