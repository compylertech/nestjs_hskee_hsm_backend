import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn('uuid')
  address_id: string;

  @Column()
  address_type: string;

  @Column({ default: false })
  primary: boolean;

  @Column()
  address_1: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  region: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  address_postalcode: string;

  @ManyToOne(() => User, (user) => user.address)
  user: User;
}
