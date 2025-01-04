export enum EntityAmenityTypeEnum {
    PROPERTY = 'property',
    UNIT = 'unit',
    ENTITY_PROPERTY = 'entity_property',
    ENTITY_UNIT = 'entity_unit'
}

export const EntityAmenityTypeEnumChecks = Object.values(EntityAmenityTypeEnum).map(value => `'${value}'`).join(', ');