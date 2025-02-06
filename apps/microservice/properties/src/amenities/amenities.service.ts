import { In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// base service
import { BaseService } from '@app/modules/common/base-impl.service';

// enum
import { EntityAmenityTypeEnum } from '@app/contracts/properties/entity-amenities/entity-amenities.enum';

// entity
import { Amenities } from './entities/amenities.entity';
import { EntityAmenities } from '../entity-amenities/entities/entity-amenities.entity';

// contracts
import { AmenitiesDto, CreateAmenitiesDto, UpdateAmenitiesDto } from '@app/contracts';

@Injectable()
export class AmenitiesService extends BaseService<
    Amenities,
    AmenitiesDto,
    CreateAmenitiesDto,
    UpdateAmenitiesDto
> {
    constructor(
        @InjectRepository(Amenities) amenitiesRepository: Repository<Amenities>,
        @InjectRepository(EntityAmenities) private entityAmenityRepository: Repository<EntityAmenities>
    ) {
        super(amenitiesRepository, AmenitiesDto, 'amenities');
    }

    async findByEntity(
        entityIds: string[],
        entityType: EntityAmenityTypeEnum | undefined = null
    ): Promise<any> {
        const whereCondition = entityType
            ? { entity_id: In(entityIds), entity_type: entityType }
            : { entity_id: In(entityIds) };

        const entityAmenities = await this.entityAmenityRepository.find({
            where: whereCondition,
            relations: ['amenities'],
        });

        return entityAmenities.reduce((acc, curr) => {
            if (!acc[curr.entity_id]) {
                acc[curr.entity_id] = [];
            }
            acc[curr.entity_id].push(curr);
            return acc;
        }, {});
    }
}