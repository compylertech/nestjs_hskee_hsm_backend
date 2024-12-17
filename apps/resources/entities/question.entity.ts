import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Questionnaire } from './questionnaire.entity';
import { Answer } from './answer.entity';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  question_id: string;

  @Column()
  question_type: string;

  @Column()
  content: string;

  @ManyToOne(() => Questionnaire, (questionnaire) => questionnaire.questions)
  questionnaire: Questionnaire;

  @OneToMany(() => Answer, (answer) => answer.question, { cascade: true })
  answers: Answer[];
}
