import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tour_bookings')
export class TourBooking {
  @PrimaryGeneratedColumn('uuid')
  tour_booking_id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone_number: string;

  @Column()
  tour_type: string;

  @Column()
  status: string;

  @Column()
  tour_date: string;

  @Column()
  property_unit_assoc_id: string;

  @Column()
  user_id: string;
}
