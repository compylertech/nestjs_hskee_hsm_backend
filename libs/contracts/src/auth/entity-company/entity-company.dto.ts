// enum
import { CompanyTypeEnum, EntityCompanyTypeEnum } from "./entity-company.enum";

export class EntityCompanyDto {
    entity_company_id: string;
    company_id: string;
    company_type: CompanyTypeEnum;
    entity_id: string;
    entity_type: EntityCompanyTypeEnum;
}
