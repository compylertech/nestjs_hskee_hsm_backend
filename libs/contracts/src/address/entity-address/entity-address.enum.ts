export enum EntityAddressTypeEnum {
    PROPERTY = 'property',
    USER = 'user',
    PAST_RENTAL_HISTORY = 'pastrentalhistory',
    ACCOUNT = 'account',
    ROLE = 'role',
    ENTITY_PROPERTY = 'entity_property',
    ENTITY_ACCOUNT = 'entity_account'
}

export const EntityAddressTypeEnumChecks = Object.values(EntityAddressTypeEnum).map(value => `'${value}'`).join(', ');