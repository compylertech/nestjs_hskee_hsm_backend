import { Entity, Column, ManyToOne, JoinColumn, OneToOne, ChildEntity, BeforeInsert, PrimaryGeneratedColumn } from 'typeorm';

// entity
import { Property } from '../../property/entities/property.entity';
import { PropertyUnitAssoc } from '../../property/entities/property-unit-assoc.entity';

// enum
import { PropertyStatus } from '@app/contracts/properties/property/property.enum';
import { PropertyUnitAssocService } from '../../property/prop-assoc.service';

@Entity('units') 
// export class Unit extends PropertyUnitAssoc {
export class Unit {
  private static propertyUnitAssocService: PropertyUnitAssocService;

  public static setPropertyUnitAssocService(service: PropertyUnitAssocService) {
    this.propertyUnitAssocService = service;
  }
  @PrimaryGeneratedColumn('uuid')
  property_unit_assoc_id: string;

  @OneToOne(() => PropertyUnitAssoc, (propertyUnitAssoc) => propertyUnitAssoc.property, { cascade: true })
  @JoinColumn({ name: 'property_unit_assoc_id' })
  property_unit_assoc: PropertyUnitAssoc;

  @ManyToOne(() => Property, (property) => property.units, { nullable: false })
  @JoinColumn({ name: 'property_id' })
  property: Property;

  @Column()
  property_id: string;

  @Column({ length: 128 })
  property_unit_code: string;
  
  @Column()
  property_unit_floor_space: number;

  @Column('decimal', { precision: 10, scale: 2 })
  property_unit_amount: number;

  @Column('decimal', { precision: 10, scale: 2 })
  property_unit_security_deposit: number;

  @Column('decimal', { precision: 10, scale: 2 })
  property_unit_commission: number;

  @Column()
  property_floor_id: number;

  @Column({
    type: 'enum',
    enum: PropertyStatus,
  })
  property_status: PropertyStatus;

  @Column('text')
  property_unit_notes: string;

  @Column({ default: false })
  has_amenities: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @BeforeInsert()
  async createPropertyUnitAssoc() {
    if (!Unit.propertyUnitAssocService) {
      throw new Error('PropertyUnitAssocService is not initialized.');
    }

    const assoc = Unit.propertyUnitAssocService.propertyUnitAssocRepository.create({
      property_unit_type: 'Unit',
    });

    const savedAssoc = await Unit.propertyUnitAssocService.propertyUnitAssocRepository.save(assoc);
    this.property_unit_assoc_id = savedAssoc.property_unit_assoc_id;
  }
}
