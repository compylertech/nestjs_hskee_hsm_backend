import { Column, ManyToOne, JoinColumn, Entity, OneToOne, TableInheritance, BeforeInsert, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

// entity
import { PropertyType } from './property-type.entity';
import { PropertyUnitAssoc } from './property-unit-assoc.entity';

// enum
import { PropertyStatus } from '@app/contracts/properties/property/property.enum';

// service
import { PropertyUnitAssocService } from '../prop-assoc.service';
import { Unit } from '../../unit/entities/unit.entity';


@Entity('property')
// @TableInheritance({ column: { type: 'varchar', name: 'property_unit_type' } })
// export class Property extends PropertyUnitAssoc {
export class Property {
  private static propertyUnitAssocService: PropertyUnitAssocService;

  public static setPropertyUnitAssocService(service: PropertyUnitAssocService) {
    this.propertyUnitAssocService = service;
  }

  @PrimaryGeneratedColumn('uuid')
  property_unit_assoc_id: string;

  @OneToOne(() => PropertyUnitAssoc, (propertyUnitAssoc) => propertyUnitAssoc.property, { cascade: true })
  @JoinColumn({ name: 'property_unit_assoc_id' })
  property_unit_assoc: PropertyUnitAssoc;

  @OneToMany(() => Unit, (unit) => unit.property, { cascade: true })
  units: Unit[];

  @Column({ length: 255 })
  name: string;

  @ManyToOne(() => PropertyType, { eager: true, nullable: true })
  @JoinColumn({ name: 'property_type' })
  property_type: PropertyType;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column('decimal', { precision: 10, scale: 2 })
  security_deposit: number;

  @Column('decimal', { precision: 10, scale: 2 })
  commission: number;

  @Column('decimal', { precision: 8, scale: 2 })
  floor_space: number;

  @Column()
  num_units: number;

  @Column()
  num_bathrooms: number;

  @Column()
  num_garages: number;

  @Column({ default: false })
  has_balconies: boolean;

  @Column({ default: false })
  has_parking_space: boolean;

  @Column({ default: false })
  pets_allowed: boolean;

  @Column('text', { nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: PropertyStatus,
  })
  property_status: PropertyStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @BeforeInsert()
  async createPropertyUnitAssoc() {
    if (!Property.propertyUnitAssocService) {
      throw new Error('PropertyUnitAssocService is not initialized.');
    }

    const assoc = Property.propertyUnitAssocService.propertyUnitAssocRepository.create({
      property_unit_type: 'Property',
    });

    const savedAssoc = await Property.propertyUnitAssocService.propertyUnitAssocRepository.save(assoc);
    this.property_unit_assoc_id = savedAssoc.property_unit_assoc_id;
    // this.property_unit_type = savedAssoc.property_unit_type;
  }
}