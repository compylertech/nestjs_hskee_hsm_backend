import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Role } from './role.entity';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  permission_id: string;

  @Column()
  name: string;

  @Column()
  alias: string;

  @Column()
  description: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}
