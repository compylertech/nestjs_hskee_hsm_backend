import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

// enum
import { AnswerType } from '@app/contracts';

// entity
import { Question } from '../../questions/entities/questions.entity';
import { EntityQuestionnaire } from '../../questionnaire/entities/entity-questionnaire.entity';

@Entity('answer')
export class Answer {
  @PrimaryGeneratedColumn('uuid')
  answer_id: string;

  // @Column({ type: 'varchar', length: 100, nullable: false })
  @Column({ type: 'enum', enum: AnswerType, nullable: false })
  answer_type: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @ManyToOne(() => Question, (question) => question.answers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @OneToMany(() => EntityQuestionnaire, (entityQuestionnaire) => entityQuestionnaire.question, { cascade: true })
  entity_questionnaire: EntityQuestionnaire[];
  
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
