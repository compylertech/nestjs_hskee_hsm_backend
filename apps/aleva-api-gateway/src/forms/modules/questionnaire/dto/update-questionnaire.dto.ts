import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsArray, ValidateNested, IsNotEmpty } from 'class-validator';

// dto
import { UpdateQuestionDto } from '../../questions/dto/update-question.dto';

export class UpdateQuestionnaireDto {
  @ApiProperty({ description: 'ID of the questionnaire to update', example: '6bbe14a9-2dfd-488a-a372-6428895a7625' })
  @IsString()
  @IsOptional()
  questionnaire_id?: string;

  @ApiProperty({ description: 'Title of the questionnaire', example: 'Cleaning' })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  title?: string;

  @ApiProperty({ description: 'Description of the questionnaire', example: 'Dope' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Tag added to the questionnaire', example: 'onboarding' })
  @IsString()
  @IsOptional()
  tag?: string;

  @ApiProperty({
    description: 'List of questions to update in the questionnaire',
    type: [UpdateQuestionDto],
    example: [],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateQuestionDto)
  @IsOptional()
  questions?: UpdateQuestionDto[];

  @ApiProperty({ description: 'Indicates if the questionnaire is published for registration', example: false })
  @IsBoolean()
  @IsOptional()
  publish_for_registration?: boolean;

  @ApiProperty({ description: 'Indicates if the questionnaire is published', example: false })
  @IsBoolean()
  @IsOptional()
  published?: boolean;
}
