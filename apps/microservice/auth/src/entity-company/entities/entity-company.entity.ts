import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Check,
    Index,
} from 'typeorm';

// enum
import { CompanyTypeEnum, EntityTypeEnum } from '@app/contracts';

@Entity('entity_company')
@Check(`"entity_type" IN ('property', 'user')`)
export class EntityCompany {
    @PrimaryGeneratedColumn('uuid')
    entity_company_id: string;

    @Column({ type: 'uuid' })
    @Index()
    company_id: string;

    @Column({
        type: 'enum',
        enum: CompanyTypeEnum,
        default: CompanyTypeEnum.AGENCY,
    })
    company_type: CompanyTypeEnum;

    @Column({ type: 'uuid' })
    entity_id: string;

    @Column({
        type: 'enum',
        enum: EntityTypeEnum,
    })
    entity_type: EntityTypeEnum;
}
