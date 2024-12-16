import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendEmailDto {
  @ApiProperty({ description: 'The email of the user',  example: 'daniel.quaidoo@gmail.com'})
  @IsNotEmpty()
  @IsString()
  recipient: string;

  @ApiProperty({ description: 'The email of the user',  example: 'Daniel Quaidoo'})
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'The email of the user',  example: 'daniel.quaidoo@gmail.com'})
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
