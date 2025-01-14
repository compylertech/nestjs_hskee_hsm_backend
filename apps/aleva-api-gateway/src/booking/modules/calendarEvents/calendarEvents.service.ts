import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

// constants
import { CALENDAREVENTS_CLIENT } from '../common/utils/constants';

// contracts
import {
  CALENDAREVENTS_PATTERN,
  CalendarEventsDto as ClientCalendarEventsDto,
  CreateCalendarEventsDto as ClientCreateCalendarEventsDto,
  UpdateCalendarEventsDto as ClientUpdateCalendarEventsDto
} from '@app/contracts';

// dto
import { CreateCalendarEventsDto } from './dto/create-calendarevents.dto';
import { UpdateCalendarEventsDto } from './dto/update-calendarevents.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';


@Injectable()
export class CalendarEventsService {
  constructor(@Inject(CALENDAREVENTS_CLIENT) private readonly calendareventsClient: ClientProxy) { }

  async create(createCalendarEventsDto: CreateCalendarEventsDto): Promise<ClientCalendarEventsDto> {
    const createCalendarEventsContract: CreateCalendarEventsDto = { ...createCalendarEventsDto };

    return this.calendareventsClient.send<ClientCalendarEventsDto, ClientCreateCalendarEventsDto>(
      CALENDAREVENTS_PATTERN.CREATE, createCalendarEventsContract
    ).toPromise();
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<ClientCalendarEventsDto[]> {
    return this.calendareventsClient.send<ClientCalendarEventsDto[]>(
      CALENDAREVENTS_PATTERN.FIND_ALL,
      pageOptionsDto
    ).toPromise();
  }

  async findOne(calendareventsId: string): Promise<ClientCalendarEventsDto> {
    return this.calendareventsClient
      .send<ClientCalendarEventsDto>(CALENDAREVENTS_PATTERN.FIND_ONE, calendareventsId)
      .toPromise();
  }

  async update(calendareventsId: string, updateCalendarEventsDto: UpdateCalendarEventsDto): Promise<ClientCalendarEventsDto> {
    const updateCalendarEventsContract: UpdateCalendarEventsDto = { ...updateCalendarEventsDto };

    return this.calendareventsClient.send<ClientCalendarEventsDto, ClientUpdateCalendarEventsDto>(
      CALENDAREVENTS_PATTERN.UPDATE,
      { calendarevents_id: calendareventsId, ...updateCalendarEventsContract }
    ).toPromise();
  }

  async remove(calendareventsId: string): Promise<void> {
    return this.calendareventsClient.send<ClientCalendarEventsDto>(
      CALENDAREVENTS_PATTERN.REMOVE,
      calendareventsId
    ).toPromise();
  }
}

