import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsString, IsOptional } from 'class-validator';

// enum
import { CompanyTypeEnum, EntityCompanyTypeEnum } from '@app/contracts';

export class UpdateEntityCompanyDto {
    @ApiPropertyOptional({ description: 'Unique ID of the entity company', example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsString()
    @IsOptional()
    entity_company_id?: string;

    @ApiPropertyOptional({ description: 'Unique ID of the company', example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsString()
    @IsOptional()
    company_id?: string;

    @ApiPropertyOptional({ description: 'Type of the company', enum: CompanyTypeEnum, example: CompanyTypeEnum.AGENCY })
    @IsEnum(CompanyTypeEnum)
    @IsOptional()
    company_type?: CompanyTypeEnum;

    @ApiPropertyOptional({ description: 'Unique ID of the entity', example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsString()
    @IsOptional()
    entity_id?: string;

    @ApiPropertyOptional({ description: 'Type of the entity', enum: EntityCompanyTypeEnum, example: EntityCompanyTypeEnum.PROPERTY })
    @IsEnum(EntityCompanyTypeEnum)
    @IsOptional()
    entity_type?: EntityCompanyTypeEnum;
}