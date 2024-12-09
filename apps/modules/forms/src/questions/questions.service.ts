import { Injectable } from '@nestjs/common';

// contracts
import { QuestionDto, CreateQuestionDto, UpdateQuestionDto } from '@app/contracts';

@Injectable()
export class QuestionsService {
  private forms: QuestionDto[] = [
    {
      id: 1,
      title: 'Question 1',
      author: 'Author 1',
      rating: 3.9
    },
    {
      id: 2,
      title: 'Question 2',
      author: 'Author 2',
      rating: 4.7
    }
  ]

  create(createQuestionDto: CreateQuestionDto) {
    const newQuestion: QuestionDto = {
      ...createQuestionDto,
      id: this.forms.length + 1
    }

    this.forms.push(newQuestion);

    return newQuestion;
  }

  findAll() {
    return this.forms;
  }

  findOne(id: number) {
    return `This action returns a #${id} question`;
  }

  update(id: number, updateQuestionDto: UpdateQuestionDto) {
    return `This action updates a #${id} question`;
  }

  remove(id: number) {
    return `This action removes a #${id} question`;
  }
}
