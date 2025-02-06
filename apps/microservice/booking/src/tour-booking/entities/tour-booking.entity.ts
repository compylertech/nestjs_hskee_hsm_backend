import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";

// enum
import { TourStatus } from "@app/contracts/communication/tour-booking/tour-status.enum";
import { TourType } from "@app/contracts/communication/tour-booking/tour-type.enum";

// entity
import { PropertyUnitAssoc } from "@app/modules/properties/src/property/entities/property-unit-assoc.entity";
import { User } from "@app/modules/auth/src/users/entities/user.entity";


@Entity('tour')
export class TourBookings {
    @PrimaryGeneratedColumn('uuid')
    tour_booking_id: string;

    @Column({ type: 'varchar' })
    name: string;

    @Column({ type: 'varchar' })
    email: string;

    @Column({ type: 'varchar' })
    phone_number: string;

    @Column({ type: 'enum', enum: TourType, default: TourType.IN_PERSON })
    tour_type: TourType;

    @Column({ type: 'enum', enum: TourStatus, default: TourStatus.INCOMING })
    status: TourStatus;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    tour_date: Date;

    @ManyToOne(() => PropertyUnitAssoc, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'property_unit_assoc_id' })
    property_unit_assoc: PropertyUnitAssoc;

    @ManyToOne(() => User, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user?: User;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
  
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;
}