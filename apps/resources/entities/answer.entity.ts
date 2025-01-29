import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Question } from './question.entity';

@Entity('answers')
export class Answer {
  [x: string]: any;
  @PrimaryGeneratedColumn('uuid')
  answer_id: string;

  @Column()
  answer_type: string;

  @Column()
  content: string;

  @ManyToOne(() => Question, (question) => question.answers)
  question: Question;
}
