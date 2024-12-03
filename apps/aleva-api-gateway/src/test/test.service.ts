import { map } from 'rxjs';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

// constants
import { TEST_CLIENT } from '../constants';

// contracts
import {
  TEST_PATTERNS,
  TestDto as ClientTestDto,
  CreateTestDto as ClientCreateTestDto,
  UpdateTestDto as ClientUpdateTestDto
} from '@app/contracts';

// dto
import { TestDto } from './dto/test.dto';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';

@Injectable()
export class TestService {
  constructor(@Inject(TEST_CLIENT) private testClient: ClientProxy) { }

  private mapBookDto(testDto: ClientTestDto): TestDto {
    return {
      id: testDto.id,
      title: testDto.title
    }
  }

  create(createBookDto: CreateTestDto) {
    return this.testClient.send<ClientTestDto, ClientCreateTestDto>(
      TEST_PATTERNS.CREATE, 
      createBookDto
    ).pipe(map(this.mapBookDto))
  }

  findAll() {
    return this.testClient.send<ClientTestDto>(
      TEST_PATTERNS.FIND_ALL,
      {}
    )
  }

  findOne(id: number) {
    return this.testClient.send<ClientTestDto>(
      TEST_PATTERNS.FIND_ONE, {
      id
    })
  }

  update(id: number, updateBookDto: UpdateTestDto) {
    return this.testClient.send<ClientTestDto, ClientUpdateTestDto>(
      TEST_PATTERNS.UPDATE,
      { id, ...updateBookDto }
    )
  }

  remove(id: number) {
    return this.testClient.send<ClientTestDto>(
      TEST_PATTERNS.REMOVE,
      { id }
    )
  }
}
