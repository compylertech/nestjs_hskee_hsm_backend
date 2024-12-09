// import { Injectable } from '@nestjs/common';

// // contracts
// import { CityDto, CreateCityDto, UpdateCityDto } from '@app/contracts';

// @Injectable()
// export class CityService {
//   private cities: CityDto[] = [
//     {
//       id: 1,
//       name: 'City 1',
//       description: 'City 1'
//     },
//     {
//       id: 2,
//       name: 'City 2',
//       description: 'City 2'
//     }
//   ]

//   create(createCityDto: CreateCityDto) {
//     const newCity: CityDto = {
//       ...createCityDto,
//       id: this.cities.length + 1
//     }

//     this.cities.push(newCity);

//     return newCity;
//   }

//   findAll() {
//     return this.cities;
//   }

//   findOne(id: number) {
//     return `This action returns a #${id} city`;
//   }

//   update(id: number, updateCityDto: UpdateCityDto) {
//     return `This action updates a #${id} city`;
//   }

//   remove(id: number) {
//     return `This action removes a #${id} city`;
//   }
// }
