import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Message } from '../message/entities/entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async findAll(query) {
    return this.messageRepository.find({ where: query });
  }

  async findOne(id: string) {
    return this.messageRepository.findOne({ where: { message_id: id } });
  }

  async findUserMessages(user_id: string, filter: Partial<Message>) {
    return this.messageRepository.find({
      where: [
        { sender_id: user_id, ...filter },
        { recipient_ids: In([user_id]), ...filter },
      ],
    });
  }

  async create(data: Partial<Message>) {
    return this.messageRepository.save(data);
  }

  async reply(data: Partial<Message>) {
    return this.create(data);
  }

  async update(id: string, data: Partial<Message>) {
    await this.messageRepository.update(id, data);
    return this.findOne(id);
  }

  async delete(id: string) {
    return this.messageRepository.delete(id);
  }
}
