import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

// entity
import { EntityAccount } from './entities/entity-account.entity';

// contracts
import { EntityAccountDto, CreateEntityAccountDto, UpdateEntityAccountDto, EntityAccountTypeEnum } from '@app/contracts';

// page-meta
import { PageDto } from 'apps/common/dto/page.dto';
import { PageMetaDto } from 'apps/common/dto/page-meta.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

@Injectable()
export class EntityAccountService {
  constructor(@InjectRepository(EntityAccount) private entityAccountRepository: Repository<EntityAccount>) { }


  async create(createEntityAccountDto: CreateEntityAccountDto): Promise<EntityAccount> {
    const newEntityAccount = this.entityAccountRepository.create(createEntityAccountDto);

    return this.entityAccountRepository.save(newEntityAccount);
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<EntityAccountDto>> {
    const options = plainToInstance(PageOptionsDto, pageOptionsDto);
    const queryBuilder = this.entityAccountRepository.createQueryBuilder('entityAccount');

    queryBuilder
      .orderBy('entityAccount.created_at', pageOptionsDto.order)
      .skip(options.skip)
      .take(options.limit);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: string): Promise<EntityAccountDto> {
    const entityAccount = await this.findEntityById(id);

    return plainToInstance(EntityAccountDto, entityAccount, { excludeExtraneousValues: false });
  }

  async findByEntity(entity_id: string, entity_type: EntityAccountTypeEnum): Promise<EntityAccount[]> {
    return await this.entityAccountRepository.find({
      where: { entity_id, entity_type },
    });
  }

  async update(id: string, updateEntityAccountDto: UpdateEntityAccountDto): Promise<EntityAccountDto> {
    const entityAccount = await this.findEntityById(id);

    // merge the updates into the entityAccount entity
    const updateEntityAccount = this.entityAccountRepository.merge(entityAccount, updateEntityAccountDto);
    await this.entityAccountRepository.save(updateEntityAccount);

    return plainToInstance(EntityAccountDto, updateEntityAccount, { excludeExtraneousValues: false });
  }

  async remove(id: string): Promise<void> {
    const entityAccount = await this.findEntityById(id);
    await this.entityAccountRepository.remove(entityAccount);
  }

  async deleteByEntity(entity_id: string, entity_type: EntityAccountTypeEnum): Promise<void> {
    await this.entityAccountRepository.delete({ entity_id, entity_type });
  }

  private async findEntityById(id: string): Promise<EntityAccount> {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid UUID: ${id}`);
    }

    const entityAccount = await this.entityAccountRepository.findOne({ where: { entity_account_id: id } });

    if (!entityAccount) {
      throw new NotFoundException(`EntityAccount with ID ${id} not found`);
    }

    return entityAccount;
  }
}
