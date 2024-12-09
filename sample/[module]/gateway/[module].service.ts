import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

// constants
import { [MODULE]_CLIENT } from '../common/utils/constants';

// contracts
import {
  [MODULE]_PATTERN,
  [Module]Dto as Client[Module]Dto,
  Create[Module]Dto as ClientCreate[Module]Dto,
  Update[Module]Dto as ClientUpdate[Module]Dto
} from '@app/contracts';

// dto
import { Create[Module]Dto } from './dto/create-[module].dto';
import { Update[Module]Dto } from './dto/update-[module].dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';


@Injectable()
export class [Module]Service {
  constructor(@Inject([MODULE]_CLIENT) private readonly [module]Client: ClientProxy) { }

  async create(create[Module]Dto: Create[Module]Dto): Promise<Client[Module]Dto> {
    const create[Module]Contract: Create[Module]Dto = { ...create[Module]Dto };

    return this.[module]Client.send<Client[Module]Dto, ClientCreate[Module]Dto>(
      [MODULE]_PATTERN.CREATE, create[Module]Contract
    ).toPromise();
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<Client[Module]Dto[]> {
    return this.[module]Client.send<Client[Module]Dto[]>(
      [MODULE]_PATTERN.FIND_ALL,
      pageOptionsDto
    ).toPromise();
  }

  async findOne([module]Id: string): Promise<Client[Module]Dto> {
    return this.[module]Client
      .send<Client[Module]Dto>([MODULE]_PATTERN.FIND_ONE, [module]Id)
      .toPromise();
  }

  async update([module]Id: string, update[Module]Dto: Update[Module]Dto): Promise<Client[Module]Dto> {
    const update[Module]Contract: Update[Module]Dto = { ...update[Module]Dto };

    return this.[module]Client.send<Client[Module]Dto, ClientUpdate[Module]Dto>(
      [MODULE]_PATTERN.UPDATE,
      { [module]_id: [module]Id, ...update[Module]Contract }
    ).toPromise();
  }

  async remove([module]Id: string): Promise<void> {
    return this.[module]Client.send<Client[Module]Dto>(
      [MODULE]_PATTERN.REMOVE,
      [module]Id
    ).toPromise();
  }
}

