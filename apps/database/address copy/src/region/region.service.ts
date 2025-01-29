// import { Injectable } from '@nestjs/common';

// // contracts
// import { RegionDto, CreateRegionDto, UpdateRegionDto } from '@app/contracts';

// @Injectable()
// export class RegionService {
//   private regions: RegionDto[] = [
//     {
//       id: 1,
//       name: 'Region 1',
//       description: 'Region 1'
//     },
//     {
//       id: 2,
//       name: 'Region 2',
//       description: 'Region 2'
//     }
//   ]

//   create(createRegionDto: CreateRegionDto) {
//     const newRegion: RegionDto = {
//       ...createRegionDto,
//       id: this.regions.length + 1
//     }

//     this.regions.push(newRegion);

//     return newRegion;
//   }

//   findAll() {
//     return this.regions;
//   }

//   findOne(id: number) {
//     return `This action returns a #${id} region`;
//   }

//   update(id: number, updateRegionDto: UpdateRegionDto) {
//     return `This action updates a #${id} region`;
//   }

//   remove(id: number) {
//     return `This action removes a #${id} region`;
//   }
// }
