import { In, Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

// entity
import { Address } from './entities/address.entity';
import { EntityAddress } from '../entity-address/entities/entity-address.entity';

// contracts
import { AddressDto, CreateAddressDto, EntityAddressTypeEnum, UpdateAddressDto } from '@app/contracts';

// page-meta
import { PageDto } from 'apps/common/dto/page.dto';
import { PageMetaDto } from 'apps/common/dto/page-meta.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address) private addressRepository: Repository<Address>,
    @InjectRepository(EntityAddress) private entityAddressRepository: Repository<EntityAddress>
  ) { }


  async create(createAddressDto: CreateAddressDto): Promise<Address> {
    const newAddress = this.addressRepository.create(createAddressDto);

    return this.addressRepository.save(newAddress);
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<AddressDto>> {
    const options = plainToInstance(PageOptionsDto, pageOptionsDto);
    const queryBuilder = this.addressRepository.createQueryBuilder('address');

    queryBuilder
      .orderBy('address.created_at', pageOptionsDto.order)
      .skip(options.skip)
      .take(options.limit);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: string): Promise<AddressDto> {
    const address = await this.findEntityById(id);

    return plainToInstance(AddressDto, address, { excludeExtraneousValues: false });
  }

  async findByEntity(entity_ids: string[], entity_type: EntityAddressTypeEnum): Promise<any> {
    const entityResponse = await this.entityAddressRepository.find({
      where: {
        entity_id: In(entity_ids),
        entity_type: entity_type,
      },
      relations: ['address'],
    });

    const dataByEntity = entityResponse.reduce((acc, curr) => {
      if (!acc[curr.entity_id]) {
        acc[curr.entity_id] = [];
      }
      acc[curr.entity_id].push(curr.address);
      return acc;
    }, {});

    return dataByEntity;
  }

  async update(id: string, updateAddressDto: UpdateAddressDto): Promise<AddressDto> {
    const address = await this.findEntityById(id);

    // merge the updates into the address entity
    const updateAddress = this.addressRepository.merge(address, updateAddressDto);
    await this.addressRepository.save(updateAddress);

    return plainToInstance(AddressDto, updateAddress, { excludeExtraneousValues: false });
  }

  async remove(id: string): Promise<void> {
    const address = await this.findEntityById(id);
    await this.addressRepository.remove(address);
  }

  private async findEntityById(id: string): Promise<Address> {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid UUID: ${id}`);
    }

    const address = await this.addressRepository.findOne({ where: { address_id: id } });

    if (!address) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }

    return address;
  }
}
