// import { Controller } from '@nestjs/common';
// import { MessagePattern, Payload } from '@nestjs/microservices';

// // services
// import { CityService } from './city.service';

// // contracts
// import { CreateCityDto, UpdateCityDto, CITY_PATTERN } from '@app/contracts';

// @Controller('city')
// export class CityController {
//   constructor(private readonly cityService: CityService) {}

//   @MessagePattern(CITY_PATTERN.CREATE)
//   create(@Payload() createCityDto: CreateCityDto) {
//     return this.cityService.create(createCityDto);
//   }

//   @MessagePattern(CITY_PATTERN.FIND_ALL)
//   findAll() {
//     return this.cityService.findAll();
//   }

//   @MessagePattern(CITY_PATTERN.FIND_ONE)
//   findOne(@Payload() id: number) {
//     return this.cityService.findOne(id);
//   }

//   @MessagePattern(CITY_PATTERN.UPDATE)
//   update(@Payload() updateCityDto: UpdateCityDto) {
//     return this.cityService.update(updateCityDto.id, updateCityDto);
//   }

//   @MessagePattern(CITY_PATTERN.REMOVE)
//   remove(@Payload() id: number) {
//     return this.cityService.remove(id);
//   }
// }
