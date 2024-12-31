import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

// dto
import { CreatePropertyDto } from './create-property.dto';
import { PropertyStatus } from '@app/contracts';

export class UpdatePropertyDto extends PartialType(CreatePropertyDto) {
    @ApiProperty()
    @IsOptional()
    @IsString()
    property_unit_assoc_id?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    name: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    property_type: string;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    amount: number;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    security_deposit: number;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    commission: number;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    floor_space: number;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    num_units: number;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    num_bathrooms: number;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    num_garages: number;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    has_balconies: boolean;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    has_parking_space: boolean;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    pets_allowed: boolean;

    @ApiProperty()
    @IsOptional()
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ enum: PropertyStatus })
    @IsEnum(PropertyStatus)
    @IsOptional()
    property_status: PropertyStatus;
}