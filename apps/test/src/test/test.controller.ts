import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { TestService } from './test.service';
import { CreateTestDto, UpdateTestDto, TEST_PATTERNS } from '@app/contracts';

@Controller()
export class TestController {
  constructor(private readonly booksService: TestService) {}

  @MessagePattern(TEST_PATTERNS.CREATE)
  create(@Payload() createBookDto: CreateTestDto) {
    return this.booksService.create(createBookDto);
  }

  @MessagePattern(TEST_PATTERNS.FIND_ALL)
  findAll() {
    return this.booksService.findAll();
  }

  @MessagePattern(TEST_PATTERNS.FIND_ONE)
  findOne(@Payload() id: number) {
    return this.booksService.findOne(id);
  }

  @MessagePattern(TEST_PATTERNS.UPDATE)
  update(@Payload() updateBookDto: UpdateTestDto) {
    return this.booksService.update(updateBookDto.id, updateBookDto);
  }

  @MessagePattern(TEST_PATTERNS.REMOVE)
  remove(@Payload() id: number) {
    return this.booksService.remove(id);
  }
}
