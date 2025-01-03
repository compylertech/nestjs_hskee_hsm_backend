import { CompanyTypeEnum, EntityCompanyTypeEnum } from "./entity-company.enum";

export class CreateEntityCompanyDto {
    company_id: string;
    company_type?: CompanyTypeEnum;
    entity_id: string;
    entity_type: EntityCompanyTypeEnum;
  }