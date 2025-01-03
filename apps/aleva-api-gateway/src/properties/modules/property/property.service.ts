import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

// constants
import { PROPERTIES_CLIENT } from '../../../common/utils/constants';

// contract
import {
  EntityMediaTypeEnum,
  EntityAmenityTypeEnum,

  PROPERTY_PATTERN,
  PropertyDto as ClientPropertyDto,
  CreatePropertyDto as ClientCreatePropertyDto,
  UpdatePropertyDto as ClientUpdatePropertyDto
} from '@app/contracts';

// dto
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

// service
import { AmenitiesService } from '../amenities/amenities.service';
import { BaseService } from 'apps/aleva-api-gateway/src/common/service/base.service';
import { MediaService } from 'apps/aleva-api-gateway/src/resources/modules/media/media.service';
import { AccountService } from 'apps/aleva-api-gateway/src/billing/modules/account/account.service';
import { AddressService } from 'apps/aleva-api-gateway/src/address/modules/address/address.service';

@Injectable()
export class PropertyService extends BaseService<
  EntityAmenityTypeEnum | EntityMediaTypeEnum,
  CreatePropertyDto,
  UpdatePropertyDto,
  ClientPropertyDto,
  ClientCreatePropertyDto,
  ClientUpdatePropertyDto,
  null,
  null
> {
  private readonly entityIdKey = 'property_unit_assoc_id';

  constructor(
    private readonly mediaService: MediaService,
    private readonly accountService: AccountService,
    private readonly addressService: AddressService,
    private readonly amenityService: AmenitiesService,
    @Inject(PROPERTIES_CLIENT) private readonly propertyClient: ClientProxy
  ) {
    super(
      'property_unit_assoc_id',
      propertyClient,
      {
        ...PROPERTY_PATTERN,
        LINK_ENTITY: '',
        DELETE_BY_ENTITY: ''
      },
      null,
      [
        {
          service: mediaService,
          entityType: EntityMediaTypeEnum.PROPERTY,
          mapKey: 'media',
        },
        {
          service: amenityService,
          entityType: EntityAmenityTypeEnum.PROPERTY,
          mapKey: 'amenities',
        },
        {
          service: accountService,
          entityType: EntityAmenityTypeEnum.PROPERTY,
          mapKey: 'account',
        },
        {
          service: addressService,
          entityType: EntityAmenityTypeEnum.PROPERTY,
          mapKey: 'address',
        },
      ]
    );
  }

  async create(createPropertyDto: CreatePropertyDto): Promise<ClientPropertyDto> {
    const { media, amenities, account, address, ...createPropertyContract } = createPropertyDto;

    // create the property
    const propertyResponse = await this.propertyClient
      .send<ClientPropertyDto, ClientCreatePropertyDto>(PROPERTY_PATTERN.CREATE, createPropertyContract)
      .toPromise();

    const fieldResponses = await this.createEntityFields(propertyResponse[this.entityIdKey], createPropertyDto);

    // merge all responses
    return { ...propertyResponse, ...fieldResponses };
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<ClientPropertyDto[]> {
    const properties = await this.propertyClient.send<ClientPropertyDto[]>(
      PROPERTY_PATTERN.FIND_ALL,
      pageOptionsDto
    ).toPromise();

    const mappedData = await this.fetchAndMap(properties["data"], this.entityIdKey);

    return { ...properties, data: mappedData };
  }

  async findOne(propertyId: string): Promise<ClientPropertyDto> {
    const property = await this.propertyClient
      .send<ClientPropertyDto>(PROPERTY_PATTERN.FIND_ONE, propertyId)
      .toPromise();

    const mappedData = await this.fetchAndMap([property], this.entityIdKey);

    return { ...mappedData[0] };
  }

  async update(propertyId: string, updatePropertyDto: UpdatePropertyDto): Promise<ClientPropertyDto> {
    const { media, amenities, account, address, ...updatePropertyContract } = updatePropertyDto;

    // update entity details
    return await this.updateEntityFields(propertyId, updatePropertyDto, updatePropertyContract);
  }

  async remove(propertyId: string): Promise<void> {
    // remove entity-media links
    await this.removeEntityFields(propertyId);
  }

  async updateOld(propertyId: string, updatePropertyDto: UpdatePropertyDto): Promise<ClientPropertyDto> {
    const { media, amenities, account, address, ...updatePropertyContract } = updatePropertyDto;

    // update entity details
    const propertyResponse = await this.propertyClient
      .send<ClientPropertyDto, ClientUpdatePropertyDto>(
        PROPERTY_PATTERN.UPDATE,
        { [this.entityIdKey]: propertyId, ...updatePropertyContract }
      )
      .toPromise();

    if (media && media.length > 0) {
      const existingMedia = await this.mediaService.fetchByEntityIDs([propertyId], EntityMediaTypeEnum.PROPERTY);
      const existingMediaIds = (existingMedia[propertyId] || []).map((m) => m.media_id);

      const newMedia = media.filter((m) => !m.media_id);
      const mediaToUpdate = media.filter((m) => m.media_id && existingMediaIds.includes(m.media_id));

      const newMediaResponses = await this.mediaService.createAndLinkEntities(propertyId, EntityMediaTypeEnum.PROPERTY, newMedia);
      const updatedMediaResponses = await this.mediaService.updateEntities(mediaToUpdate);

      return { ...propertyResponse, media: [...newMediaResponses, ...updatedMediaResponses] };
    }

    return { ...propertyResponse, media: [] };
  }

  async removeOld(propertyId: string): Promise<void> {
    // remove entity-media links
    await this.mediaService.removeEntityLinks(propertyId, EntityMediaTypeEnum.PROPERTY);

    // remove the property
    await this.propertyClient.send<void>(PROPERTY_PATTERN.DELETE, propertyId).toPromise();
  }
}