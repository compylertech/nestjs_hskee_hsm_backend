import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

// dto
import { PropertyStatus, UpdateMediaDto, UpdateUnitDto, UpdateAmenitiesDto } from '@app/contracts';

export class UpdatePropertyDto {
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

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateUnitDto)
    @IsOptional()
    units?: UpdateUnitDto[];
  
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateMediaDto)
    @IsOptional()
    media?: UpdateMediaDto[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateAmenitiesDto)
    @IsOptional()
    amenities?: UpdateAmenitiesDto[];
}