import { Controller } from '@nestjs/common';

// services
import { PropertiesService } from './properties.service';

// dto

@Controller('properties')
export class PropertiesController {
  constructor(private properties: PropertiesService) {}

}
