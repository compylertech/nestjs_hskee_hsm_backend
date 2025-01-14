import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../../../../../resources/entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  findAll(): Promise<Role[]> {
    return this.roleRepository.find({ relations: ['permissions', 'users'] });
  }

  findOne(role_id: string): Promise<Role> {
    return this.roleRepository.findOne({
      where: { role_id },
      relations: ['permissions', 'users'],
    });
  }

  create(roleData: Partial<Role>): Promise<Role> {
    const role = this.roleRepository.create(roleData);
    return this.roleRepository.save(role);
  }

  async update(role_id: string, roleData: Partial<Role>): Promise<Role> {
    await this.roleRepository.update(role_id, roleData);
    return this.findOne(role_id);
  }

  delete(role_id: string): Promise<void> {
    return this.roleRepository.delete(role_id).then(() => undefined);
  }
}