import {
  Check,
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Questionnaire } from './questionnaire.entity';
import { Answer } from '../../answers/entities/answer.entity';
import { Question } from '../../questions/entities/questions.entity';
import { User } from '../../../../auth/src/users/entities/user.entity';

export enum EntityTypeEnum {
  USER = 'user',
  ANSWERS = 'answers',
  QUESTIONS = 'questions',
  QUESTIONNAIRES = 'questionnaires',
}

@Entity('entity_questionnaire')
@Check(
  "entity_type IN ('user', 'questions', 'questionnaires', 'answers')"
)
export class EntityQuestionnaire {
  @PrimaryGeneratedColumn('uuid')
  entity_questionnaire_id: string;

  @Column({ type: 'uuid', nullable: false })
  entity_id: string;

  @Column({ type: 'enum', enum: EntityTypeEnum, nullable: false })
  entity_type: string;

  @Column({ name: 'questionnaire_id', nullable: false })
  questionnaire_id: string;

  @Column({ name: 'question_id', nullable: false })
  question_id: string;

  @Column({ name: 'answer_id', nullable: false })
  answer_id: string;

  @ManyToOne(() => Questionnaire, (questionnaire) => questionnaire.entity_questionnaire, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'questionnaire_id' })
  questionnaire: Questionnaire;

  @ManyToOne(() => Question, (question) => question.entity_questionnaire, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @ManyToOne(() => Answer, (answer) => answer.entity_questionnaire, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'answer_id' })
  answer: Answer;

  @Column({ type: 'boolean', default: false, nullable: true })
  mark_as_read: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => User, (user) => user.answers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'entity_id' })
  user: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
