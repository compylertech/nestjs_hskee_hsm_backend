import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

// entity
import { EntityCompany } from './entities/entity-company.entity';

// contracts
import { EntityCompanyDto, CreateEntityCompanyDto, UpdateEntityCompanyDto } from '@app/contracts';

// page-meta
import { PageDto } from 'apps/common/dto/page.dto';
import { PageMetaDto } from 'apps/common/dto/page-meta.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

@Injectable()
export class EntityCompanyService {
  constructor(@InjectRepository(EntityCompany) private entityCompanyRepository: Repository<EntityCompany>) { }


  async create(createEntityCompanyDto: CreateEntityCompanyDto): Promise<EntityCompany> {
    const newEntityCompany = this.entityCompanyRepository.create(createEntityCompanyDto);

    return this.entityCompanyRepository.save(newEntityCompany);
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<EntityCompanyDto>> {
    const options = plainToInstance(PageOptionsDto, pageOptionsDto);
    const queryBuilder = this.entityCompanyRepository.createQueryBuilder('entityCompany');
    
    queryBuilder
      .orderBy('entityCompany.created_at', pageOptionsDto.order)
      .skip(options.skip)
      .take(options.limit);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: string): Promise<EntityCompanyDto> {
    const entityCompany = await this.findEntityById(id);

    return plainToInstance(EntityCompanyDto, entityCompany, { excludeExtraneousValues: false });
  }

  async update(id: string, updateEntityCompanyDto: UpdateEntityCompanyDto): Promise<EntityCompanyDto> {
    const entityCompany = await this.findEntityById(id);

    // merge the updates into the entityCompany entity
    const updateEntityCompany = this.entityCompanyRepository.merge(entityCompany, updateEntityCompanyDto);
    await this.entityCompanyRepository.save(updateEntityCompany);

    return plainToInstance(EntityCompanyDto, updateEntityCompany, { excludeExtraneousValues: false });
  }

  async remove(id: string): Promise<void> {
    const entityCompany = await this.findEntityById(id);
    await this.entityCompanyRepository.remove(entityCompany);
  }

  private async findEntityById(id: string): Promise<EntityCompany> {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid UUID: ${id}`);
    }

    const entityCompany = await this.entityCompanyRepository.findOne({ where: { entity_company_id: id } });

    if (!entityCompany) {
      throw new NotFoundException(`EntityCompany with ID ${id} not found`);
    }

    return entityCompany;
  }
}
