import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendEmailDto {
  @ApiProperty({ description: 'The email of the user',  example: 'daniel.quaidoo@gmail.com'})
  @IsNotEmpty()
  @IsString()
  recipient: string;

  @ApiProperty({ description: 'The first name of the user',  example: 'Daniel Quaidoo'})
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @ApiProperty({ description: 'The last name of the user',  example: 'Daniel Quaidoo'})
  @IsNotEmpty()
  @IsString()
  last_name: string;

  @ApiProperty({ description: 'The email of the user',  example: 'daniel.quaidoo@gmail.com'})
  @IsNotEmpty()
  @IsEmail()
  user_email: string;

  @ApiProperty({ description: 'The phone number of the user',  example: '233245667788'})
  @IsOptional()
  phone_number?: string;

  @ApiProperty({ description: 'The qr code for the user',  example: ''})
  @IsOptional()
  qr_code?: string;

  @ApiProperty({ description: 'The unsubscribe link',  example: ''})
  @IsOptional()
  unsubscribe_link?: string;
}
