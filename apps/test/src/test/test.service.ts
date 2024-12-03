import { Injectable } from '@nestjs/common';

import { TestDto, CreateTestDto, UpdateTestDto } from '@app/contracts';

@Injectable()
export class TestService {
  private books: TestDto[] = [
    {
      id: 1,
      title: 'Title 1',
      author: 'Author 1',
      rating: 3.9
    },
    {
      id: 2,
      title: 'Title 2',
      author: 'Author 2',
      rating: 4.7
    }
  ]

  create(createBookDto: CreateTestDto) {
    const newBook: TestDto = {
      ...createBookDto,
      id: this.books.length + 1
    }

    this.books.push(newBook);

    return newBook;
  }

  findAll() {
    return this.books;
  }

  findOne(id: number) {
    return `This action returns a #${id} book`;
  }

  update(id: number, updateBookDto: UpdateTestDto) {
    return `This action updates a #${id} book`;
  }

  remove(id: number) {
    return `This action removes a #${id} book`;
  }
}
