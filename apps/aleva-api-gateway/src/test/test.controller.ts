import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

// services
import { TestService } from './test.service';

// dto
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';

@Controller('tests')
export class TestController {
  constructor(private testService: TestService) {}

  @Post()
  create(@Body() createBookDto: CreateTestDto) {
    return this.testService.create(createBookDto);
  }

  @Get()
  findAll() {
    return this.testService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateTestDto) {
    return this.testService.update(+id, updateBookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testService.remove(+id);
  }
}
