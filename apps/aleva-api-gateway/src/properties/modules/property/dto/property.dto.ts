import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsEnum, IsBoolean, IsArray, ValidateNested } from 'class-validator';

// enum
import { PropertyStatus } from '@app/contracts/properties/property/property.enum';

// dto
import { MediaDto, UnitDto } from '@app/contracts';

export class PropertyDto {
    @ApiProperty()
    property_unit_assoc_id: string;

    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    property_type: string;

    @ApiProperty()
    @IsNumber()
    amount: number;

    @ApiProperty()
    @IsNumber()
    security_deposit: number;

    @ApiProperty()
    @IsNumber()
    commission: number;

    @ApiProperty()
    @IsNumber()
    floor_space: number;

    @ApiProperty()
    @IsNumber()
    num_units: number;

    @ApiProperty()
    @IsNumber()
    num_bathrooms: number;

    @ApiProperty()
    @IsNumber()
    num_garages: number;

    @ApiProperty()
    @IsBoolean()
    has_balconies: boolean;

    @ApiProperty()
    @IsBoolean()
    has_parking_space: boolean;

    @ApiProperty()
    @IsBoolean()
    pets_allowed: boolean;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ enum: PropertyStatus })
    @IsEnum(PropertyStatus)
    property_status: PropertyStatus;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UnitDto)
    @IsOptional()
    units?: UnitDto[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MediaDto)
    @IsOptional()
    media?: MediaDto[];
}
