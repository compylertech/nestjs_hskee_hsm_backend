export enum EntityMediaTypeEnum {
    PROPERTY = 'property',
    USER = 'user',
    UNITS = 'units',
    AMENITIES = 'amenities',
    CONTRACT = 'contract',
    MAINTENANCE_REQUESTS = 'maintenance_requests',
    
    // New prefixed values
    ENTITY_PROPERTY = 'entity_property',
    ENTITY_USER = 'entity_user',
    ENTITY_UNITS = 'entity_units',
    ENTITY_AMENITIES = 'entity_amenities',
    ENTITY_CONTRACT = 'entity_contract',
    ENTITY_MAINTENANCE_REQUESTS = 'entity_maintenance_requests',
}

export const EntityMediaTypeEnumChecks = Object.values(EntityMediaTypeEnum).map(value => `'${value}'`).join(', ');