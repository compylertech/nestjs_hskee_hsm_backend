import { ApiProperty } from '@nestjs/swagger';

// enum
import { CompanyTypeEnum, EntityCompanyTypeEnum } from '@app/contracts';

export class EntityCompanyDto {
    @ApiProperty({ description: 'Unique ID of the entity company', example: '123e4567-e89b-12d3-a456-426614174000' })
    entity_company_id: string;

    @ApiProperty({ description: 'Unique ID of the company', example: '123e4567-e89b-12d3-a456-426614174000' })
    company_id: string;

    @ApiProperty({ description: 'Type of the company', enum: CompanyTypeEnum, example: CompanyTypeEnum.AGENCY })
    company_type: CompanyTypeEnum;

    @ApiProperty({ description: 'Unique ID of the entity', example: '123e4567-e89b-12d3-a456-426614174000' })
    entity_id: string;

    @ApiProperty({ description: 'Type of the entity', enum: EntityCompanyTypeEnum, example: EntityCompanyTypeEnum.PROPERTY })
    entity_type: EntityCompanyTypeEnum;
}