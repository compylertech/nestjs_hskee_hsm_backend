import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TourBooking } from './entitiies/entity';

@Injectable()
export class TourBookingService {
  constructor(
    @InjectRepository(TourBooking)
    private readonly tourBookingRepository: Repository<TourBooking>,
  ) {}

  async findAll(query) {
    return this.tourBookingRepository.find({ where: query });
  }

  async findOne(id: string) {
    return this.tourBookingRepository.findOne({
      where: { tour_booking_id: id },
    });
  }

  async create(data: Partial<TourBooking>) {
    return this.tourBookingRepository.save(data);
  }

  async update(id: string, data: Partial<TourBooking>) {
    await this.tourBookingRepository.update(id, data);
    return this.findOne(id);
  }

  async delete(id: string) {
    return this.tourBookingRepository.delete(id);
  }
}
