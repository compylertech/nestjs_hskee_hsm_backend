import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

// entity
import { [Module] } from './entities/[module].entity';

// contracts
import { [Module]Dto, Create[Module]Dto, Update[Module]Dto } from '@app/contracts';

// page-meta
import { PageDto } from 'apps/common/dto/page.dto';
import { PageMetaDto } from 'apps/common/dto/page-meta.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

@Injectable()
export class [Module]Service {
  constructor(@InjectRepository([Module]) private [module]Repository: Repository<[Module]>) { }


  async create(create[Module]Dto: Create[Module]Dto): Promise<[Module]> {
    const new[Module] = this.[module]Repository.create(create[Module]Dto);

    return this.[module]Repository.save(new[Module]);
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<[Module]Dto>> {
    const options = plainToInstance(PageOptionsDto, pageOptionsDto);
    const queryBuilder = this.[module]Repository.createQueryBuilder('[module]');
    
    queryBuilder
      .orderBy('[module].created_at', pageOptionsDto.order)
      .skip(options.skip)
      .take(options.limit);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: string): Promise<[Module]Dto> {
    const [module] = await this.findEntityById(id);

    return plainToInstance([Module]Dto, [module], { excludeExtraneousValues: false });
  }

  async update(id: string, update[Module]Dto: Update[Module]Dto): Promise<[Module]Dto> {
    const [module] = await this.findEntityById(id);

    // merge the updates into the [module] entity
    const update[Module] = this.[module]Repository.merge([module], update[Module]Dto);
    await this.[module]Repository.save(update[Module]);

    return plainToInstance([Module]Dto, update[Module], { excludeExtraneousValues: false });
  }

  async remove(id: string): Promise<void> {
    const [module] = await this.findEntityById(id);
    await this.[module]Repository.remove([module]);
  }

  private async findEntityById(id: string): Promise<[Module]> {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid UUID: ${id}`);
    }

    const [module] = await this.[module]Repository.findOne({ where: { [module]_id: id } });

    if (![module]) {
      throw new NotFoundException(`[Module] with ID ${id} not found`);
    }

    return [module];
  }
}
