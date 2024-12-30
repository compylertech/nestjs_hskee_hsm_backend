import { PropertyAssignmentType } from "./property.enum";

export class PropertyUnitAssocContract {
    property_unit_assoc_id: string;
    property_unit_type: string;
}
export class PropertyTypeContract {
    property_type_id: number;
    name: string;
    description: string;
}

export class PropertyAssignmentContract {
    property_assignment_id: string;
    property_unit_assoc_id: string;
    user_id: string;
    assignment_type: PropertyAssignmentType;
    date_from: Date;
    date_to: Date;
    notes: string;
}