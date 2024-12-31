// import { Injectable, Inject } from '@nestjs/common';
// import { ClientProxy } from '@nestjs/microservices';

// // constants
// import { PROPERTIES_CLIENT } from '../../../common/utils/constants';

// // contracts
// import {
//   RENTAL_HISTORY_PATTERN,
//   RentalHistoryDto as ClientRentalHistoryDto,
//   CreateRentalHistoryDto as ClientCreateRentalHistoryDto,
//   UpdateRentalHistoryDto as ClientUpdateRentalHistoryDto
// } from '@app/contracts';

// // dto
// import { CreateRentalHistoryDto } from './dto/create-rental-history.dto';
// import { UpdateRentalHistoryDto } from './dto/update-rental-history.dto';
// import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';


// @Injectable()
// export class RentalHistoryService {
//   constructor(@Inject(PROPERTIES_CLIENT) private readonly rentalHistoryClient: ClientProxy) { }

//   async create(createRentalHistoryDto: CreateRentalHistoryDto): Promise<ClientRentalHistoryDto> {
//     const createRentalHistoryContract: CreateRentalHistoryDto = { ...createRentalHistoryDto };

//     return this.rentalHistoryClient.send<ClientRentalHistoryDto, ClientCreateRentalHistoryDto>(
//       RENTAL_HISTORY_PATTERN.CREATE, createRentalHistoryContract
//     ).toPromise();
//   }

//   async findAll(pageOptionsDto: PageOptionsDto): Promise<ClientRentalHistoryDto[]> {
//     return this.rentalHistoryClient.send<ClientRentalHistoryDto[]>(
//       RENTAL_HISTORY_PATTERN.FIND_ALL,
//       pageOptionsDto
//     ).toPromise();
//   }

//   async findOne(rentalHistoryId: string): Promise<ClientRentalHistoryDto> {
//     return this.rentalHistoryClient
//       .send<ClientRentalHistoryDto>(RENTAL_HISTORY_PATTERN.FIND_ONE, rentalHistoryId)
//       .toPromise();
//   }

//   async update(rentalHistoryId: string, updateRentalHistoryDto: UpdateRentalHistoryDto): Promise<ClientRentalHistoryDto> {
//     const updateRentalHistoryContract: UpdateRentalHistoryDto = { ...updateRentalHistoryDto };

//     return this.rentalHistoryClient.send<ClientRentalHistoryDto, ClientUpdateRentalHistoryDto>(
//       RENTAL_HISTORY_PATTERN.UPDATE,
//       { rentalHistory_id: rentalHistoryId, ...updateRentalHistoryContract }
//     ).toPromise();
//   }

//   async remove(rentalHistoryId: string): Promise<void> {
//     return this.rentalHistoryClient.send<ClientRentalHistoryDto>(
//       RENTAL_HISTORY_PATTERN.DELETE,
//       rentalHistoryId
//     ).toPromise();
//   }
// }

