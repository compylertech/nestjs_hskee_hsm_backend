import { Injectable } from '@nestjs/common';

// contracts
import { AnswerDto, CreateAnswerDto, UpdateAnswerDto } from '@app/contracts';

@Injectable()
export class AnswersService {
  private answers: AnswerDto[] = [
    {
      id: 1,
      questionId: 1,
      author: 'Author A',
      content: 'Answer to Question 1',
      likes: 10
    },
    {
      id: 2,
      questionId: 2,
      author: 'Author B',
      content: 'Answer to Question 2',
      likes: 20
    }
  ];

  create(createAnswerDto: CreateAnswerDto) {
    const newAnswer: AnswerDto = {
      ...createAnswerDto,
      id: this.answers.length + 1,
      likes: 0
    };

    this.answers.push(newAnswer);

    return newAnswer;
  }

  findAll() {
    return this.answers;
  }

  findOne(id: number) {
    return this.answers.find(answer => answer.id === id) || `Answer with ID ${id} not found`;
  }

  update(id: number, updateAnswerDto: UpdateAnswerDto) {
    const index = this.answers.findIndex(answer => answer.id === id);
    if (index === -1) {
      return `Answer with ID ${id} not found`;
    }

    this.answers[index] = { ...this.answers[index], ...updateAnswerDto };
    return this.answers[index];
  }

  remove(id: number) {
    const index = this.answers.findIndex(answer => answer.id === id);
    if (index === -1) {
      return `Answer with ID ${id} not found`;
    }

    const removedAnswer = this.answers.splice(index, 1);
    return removedAnswer[0];
  }
}
