import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaintenanceRequest } from '../maintenance-request/entities/entity';

@Injectable()
export class MaintenanceRequestService {
  constructor(
    @InjectRepository(MaintenanceRequest)
    private readonly maintenanceRequestRepository: Repository<MaintenanceRequest>,
  ) {}

  async findAll(query) {
    return this.maintenanceRequestRepository.find({ where: query });
  }

  async findOne(id: string) {
    return this.maintenanceRequestRepository.findOne({ where: { maintenance_request_id: id } });
  }

  async create(data: Partial<MaintenanceRequest>) {
    return this.maintenanceRequestRepository.save(data);
  }

  async update(id: string, data: Partial<MaintenanceRequest>) {
    await this.maintenanceRequestRepository.update(id, data);
    return this.findOne(id);
  }

  async delete(id: string) {
    return this.maintenanceRequestRepository.delete(id);
  }
}
