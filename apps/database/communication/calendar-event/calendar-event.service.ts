import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CalendarEvent } from './entitites/entity';

@Injectable()
export class CalendarEventService {
  constructor(
    @InjectRepository(CalendarEvent)
    private readonly calendarEventRepository: Repository<CalendarEvent>,
  ) {}

  async findAll(limit: number, offset: number) {
    return this.calendarEventRepository.find({ skip: offset, take: limit });
  }

  async findOne(id: string) {
    return this.calendarEventRepository.findOne({ where: { calendar_event_id: id } });
  }

  async create(data: Partial<CalendarEvent>) {
    return this.calendarEventRepository.save(data);
  }

  async update(id: string, data: Partial<CalendarEvent>) {
    await this.calendarEventRepository.update(id, data);
    return this.findOne(id);
  }

  async delete(id: string) {
    return this.calendarEventRepository.delete(id);
  }
}
