import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsOptional } from 'class-validator';

// enum
import { CompanyTypeEnum, EntityCompanyTypeEnum } from '@app/contracts';

export class CreateEntityCompanyDto {
    @ApiProperty({ description: 'Unique ID of the company', example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsString()
    company_id: string;

    @ApiProperty({ description: 'Type of the company', enum: CompanyTypeEnum, example: CompanyTypeEnum.AGENCY })
    @IsEnum(CompanyTypeEnum)
    @IsOptional()
    company_type?: CompanyTypeEnum;

    @ApiProperty({ description: 'Unique ID of the entity', example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsString()
    entity_id: string;

    @ApiProperty({ description: 'Type of the entity', enum: EntityCompanyTypeEnum, example: EntityCompanyTypeEnum.PROPERTY })
    @IsEnum(EntityCompanyTypeEnum)
    entity_type: EntityCompanyTypeEnum;
}