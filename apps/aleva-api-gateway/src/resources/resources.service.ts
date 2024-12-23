import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

// constants
import { RESOURCE_CLIENT } from '../common/utils/constants';

@Injectable()
export class ResourceService {
  constructor(@Inject(RESOURCE_CLIENT) private resourceClient: ClientProxy) { }

}
