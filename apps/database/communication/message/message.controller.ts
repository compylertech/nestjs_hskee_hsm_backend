import { Controller, Get, Post, Put, Delete, Param, Query, Body } from '@nestjs/common';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get()
  async getAll(@Query('limit') limit: number, @Query('offset') offset: number, @Query('user_id') user_id: string) {
    return this.messageService.findAll({ user_id, limit, offset });
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.messageService.findOne(id);
  }

  @Get('users/:user_id/drafts')
  async getUserDrafts(@Param('user_id') user_id: string) {
    return this.messageService.findUserMessages(user_id, { is_draft: true });
  }

  @Get('users/:user_id/scheduled')
  async getUserScheduled(@Param('user_id') user_id: string) {
    return this.messageService.findUserMessages(user_id, { is_scheduled: true });
  }

  @Get('users/:user_id/outbox')
  async getUserOutbox(@Param('user_id') user_id: string) {
    return this.messageService.findUserMessages(user_id, {});
  }

  @Get('users/:user_id/inbox')
  async getUserInbox(@Param('user_id') user_id: string) {
    return this.messageService.findUserMessages(user_id, {});
  }

  @Get('users/:user_id/notifications')
  async getUserNotifications(@Param('user_id') user_id: string) {
    return this.messageService.findUserMessages(user_id, { is_notification: true });
  }

  @Post()
  async create(@Body() data) {
    return this.messageService.create(data);
  }

  @Post('reply')
  async replyToMessage(@Body() data) {
    return this.messageService.reply(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data) {
    return this.messageService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.messageService.delete(id);
  }
}
