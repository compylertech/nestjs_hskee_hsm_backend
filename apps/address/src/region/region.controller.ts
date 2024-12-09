// import { Controller } from '@nestjs/common';
// import { MessagePattern, Payload } from '@nestjs/microservices';

// // services
// import { RegionService } from './region.service';

// // contracts
// import { CreateRegionDto, UpdateRegionDto, REGION_PATTERN } from '@app/contracts';

// @Controller('region')
// export class RegionController {
//   constructor(private readonly regionService: RegionService) {}

//   @MessagePattern(REGION_PATTERN.CREATE)
//   create(@Payload() createRegionDto: CreateRegionDto) {
//     return this.regionService.create(createRegionDto);
//   }

//   @MessagePattern(REGION_PATTERN.FIND_ALL)
//   findAll() {
//     return this.regionService.findAll();
//   }

//   @MessagePattern(REGION_PATTERN.FIND_ONE)
//   findOne(@Payload() id: number) {
//     return this.regionService.findOne(id);
//   }

//   @MessagePattern(REGION_PATTERN.UPDATE)
//   update(@Payload() updateRegionDto: UpdateRegionDto) {
//     return this.regionService.update(updateRegionDto.id, updateRegionDto);
//   }

//   @MessagePattern(REGION_PATTERN.REMOVE)
//   remove(@Payload() id: number) {
//     return this.regionService.remove(id);
//   }
// }
