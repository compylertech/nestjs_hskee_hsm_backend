export enum EntityQuestionnaireTypeEnum {
    QUESTIONS = 'questions',
    USER = 'user',
}

export const EntityQuestionnaireTypeEnumChecks = Object.values(EntityQuestionnaireTypeEnum).map(value => `'${value}'`).join(', ');