import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

// constants
import { FORMS_CLIENT } from '../common/utils/constants';

@Injectable()
export class FormsService {
  constructor(@Inject(FORMS_CLIENT) private formsClient: ClientProxy) { }

}
