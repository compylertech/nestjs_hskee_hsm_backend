import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateAddressDto {
  @IsString()
  @IsOptional()
  address_type?: string;

  @IsBoolean()
  @IsOptional()
  primary?: boolean;

  @IsString()
  @IsOptional()
  address_1?: string;
  
  @IsString()
  @IsOptional()
  address_2?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  region?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  address_postalcode?: string;
}