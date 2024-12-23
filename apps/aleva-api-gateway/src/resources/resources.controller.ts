import { Controller } from '@nestjs/common';

// services
import { ResourceService } from './resources.service';

@Controller('resources')
export class ResourceController {
  constructor(private resourceService: ResourceService) {}

}
