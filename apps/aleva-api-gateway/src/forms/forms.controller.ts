import { Controller } from '@nestjs/common';

// services
import { FormsService } from './forms.service';

// dto

@Controller('forms')
export class FormsController {
  constructor(private formsService: FormsService) {}

}
