import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Question } from './question.entity';

@Entity('questionnaires')
export class Questionnaire {
  @PrimaryGeneratedColumn('uuid')
  questionnaire_id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ default: 0 })
  number_of_responses: number;

  @Column({ default: false })
  publish_for_registration: boolean;

  @Column({ default: false })
  published: boolean;

  @ManyToOne(() => User, (user) => user.questionnaires)
  user: User;

  @OneToMany(() => Question, (question) => question.questionnaire, { cascade: true })
  questions: Question[];
}
