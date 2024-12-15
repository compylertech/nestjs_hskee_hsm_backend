import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// entity
import { [Module] } from './entities/[module].entity';

// services
import { [Module]Service } from './[module].service';

// controllers
import { [Module]Controller } from './[module].controller';

@Module({
  imports: [TypeOrmModule.forFeature([[Module]])],
  controllers: [[Module]Controller],
  providers: [[Module]Service],
})
export class [Module]Module {}
