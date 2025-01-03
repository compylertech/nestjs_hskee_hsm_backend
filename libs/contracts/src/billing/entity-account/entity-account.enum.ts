export enum EntityAccountTypeEnum {
    PROPERTY = 'property',
    USER = 'user',
    ENTITY_PROPERTY = 'entity_property',
    ENTITY_USER = 'entity_user',
}

export const EntityAccountTypeEnumChecks = Object.values(EntityAccountTypeEnum).map(value => `'${value}'`).join(', ');