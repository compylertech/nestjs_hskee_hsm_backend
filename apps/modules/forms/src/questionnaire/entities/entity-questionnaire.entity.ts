import {
  Check,
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
// import { Answer, Question, Questionnaire  } from '@app/modules'
import { Questionnaire } from './questionnaire.entity';
import { Answer } from '../../answers/entities/answer.entity';
import { Question } from '../../questions/entities/questions.entity';
// import { User } from '../../../../auth/src/users/entities/user.entity';

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
  entity_type: EntityTypeEnum;

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

  // @ManyToOne(() => User, (user) => user.answers, { onDelete: 'CASCADE' })
  // user: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
