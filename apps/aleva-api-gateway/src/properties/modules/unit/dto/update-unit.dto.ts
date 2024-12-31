import { PartialType } from '@nestjs/mapped-types';

// dto
import { CreateUnitDto } from './create-unit.dto';

export class UpdateUnitDto extends PartialType(CreateUnitDto) {}