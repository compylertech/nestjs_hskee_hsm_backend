import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

// constants
import { PROPERTIES_CLIENT } from '../common/utils/constants';

@Injectable()
export class PropertiesService {
  constructor(@Inject(PROPERTIES_CLIENT) private propertiesClient: ClientProxy) { }

}
