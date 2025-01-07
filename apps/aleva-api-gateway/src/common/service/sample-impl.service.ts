// import { Injectable, Inject } from '@nestjs/common';
// import { ClientProxy } from '@nestjs/microservices';

// // Constants
// import { PROPERTIES_CLIENT } from '../../../common/utils/constants';

// // Contracts
// import {
//   EntityMediaTypeEnum,
//   EntityAmenityTypeEnum,
//   PROPERTY_PATTERN,
//   PropertyDto as ClientPropertyDto,
//   CreatePropertyDto as ClientCreatePropertyDto,
//   UpdatePropertyDto as ClientUpdatePropertyDto,
// } from '@app/contracts';

// // DTOs
// import { CreatePropertyDto } from './dto/create-property.dto';
// import { UpdatePropertyDto } from './dto/update-property.dto';
// import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

// // Services
// import { AmenitiesService } from '../amenities/amenities.service';
// import { MediaService } from 'apps/aleva-api-gateway/src/resources/modules/media/media.service';
// import { AccountService } from 'apps/aleva-api-gateway/src/billing/modules/account/account.service';
// import { AddressService } from 'apps/aleva-api-gateway/src/address/modules/address/address.service';

// // Base
// import { BaseCrudService } from 'apps/aleva-api-gateway/src/common/service/base-crud.service';

// @Injectable()
// export class PropertyService extends BaseCrudService<
//   CreatePropertyDto,
//   UpdatePropertyDto,
//   ClientPropertyDto,
//   ClientCreatePropertyDto,
//   ClientUpdatePropertyDto
// > {
//   private readonly entityIdKey = 'property_unit_assoc_id';

//   constructor(
//     private readonly mediaService: MediaService,
//     private readonly accountService: AccountService,
//     private readonly addressService: AddressService,
//     private readonly amenitiesService: AmenitiesService,
//     @Inject(PROPERTIES_CLIENT) private readonly propertyClient: ClientProxy
//   ) {
//     super(
//       'property_unit_assoc_id',
//       propertyClient,
//       new CrudService(
//         propertyClient,
//         PROPERTY_PATTERN,
//         [
//           {
//             service: amenitiesService,
//             entityType: EntityAmenityTypeEnum.PROPERTY,
//             mapKey: 'amenities',
//           },
//           {
//             service: mediaService,
//             entityType: EntityMediaTypeEnum.PROPERTY,
//             mapKey: 'media',
//           },
//           {
//             service: accountService,
//             entityType: EntityAmenityTypeEnum.PROPERTY,
//             mapKey: 'account',
//           },
//           {
//             service: addressService,
//             entityType: EntityAmenityTypeEnum.PROPERTY,
//             mapKey: 'address',
//           },
//         ]
//       )
//     );
//   }

//   /**
//    * Creates a property and related fields.
//    */
//   async create(createPropertyDto: CreatePropertyDto): Promise<ClientPropertyDto> {
//     const { media, amenities, account, address, ...createPropertyContract } = createPropertyDto;

//     const propertyResponse = await this.propertyClient
//       .send<ClientPropertyDto, ClientCreatePropertyDto>(PROPERTY_PATTERN.CREATE, createPropertyContract)
//       .toPromise();

//     const fieldResponses = await this.crudService.createEntityFields(
//       propertyResponse[this.entityIdKey],
//       createPropertyDto
//     );

//     return { ...propertyResponse, ...fieldResponses };
//   }

//   /**
//    * Fetches all properties with pagination.
//    */
//   async findAll(pageOptionsDto: PageOptionsDto): Promise<ClientPropertyDto[]> {
//     const properties = await this.propertyClient
//       .send<ClientPropertyDto[]>(PROPERTY_PATTERN.FIND_ALL, pageOptionsDto)
//       .toPromise();

//     const mappedData = await this.crudService.fetchEntitiesByIds(properties, this.entityIdKey);

//     return { ...properties, ...mappedData };
//   }

//   /**
//    * Fetches a single property by its ID.
//    */
//   async findOne(propertyId: string): Promise<ClientPropertyDto> {
//     const property = await this.propertyClient
//       .send<ClientPropertyDto>(PROPERTY_PATTERN.FIND_ONE, propertyId)
//       .toPromise();

//     const mappedData = await this.crudService.fetchEntitiesByIds([property], this.entityIdKey);

//     return { ...mappedData[0] };
//   }

//   /**
//    * Updates a property and its related fields.
//    */
//   async update(propertyId: string, updatePropertyDto: UpdatePropertyDto): Promise<ClientPropertyDto> {
//     const { media, amenities, account, address, ...updatePropertyContract } = updatePropertyDto;

//     return await this.crudService.updateEntityAndRelatedFields(
//       propertyId,
//       updatePropertyDto
//     );
//   }

//   /**
//    * Removes a property and its related fields.
//    */
//   async remove(propertyId: string): Promise<void> {
//     await this.crudService.removeEntityWithLinks(propertyId);
//   }
// }
