import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

// constants
import { ADDRESS_CLIENT } from '../common/utils/constants';

@Injectable()
export class AddressService {
    constructor(@Inject(ADDRESS_CLIENT) private addressClient: ClientProxy) { }

}