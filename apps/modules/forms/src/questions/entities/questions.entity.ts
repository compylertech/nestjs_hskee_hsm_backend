import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

// enum
import { QuestionType } from '@app/contracts';

// entity
import { Answer } from '../../answers/entities/answer.entity';
import { Questionnaire } from '../../questionnaire/entities/questionnaire.entity';
import { EntityQuestionnaire } from '../../questionnaire/entities/entity-questionnaire.entity';


@Entity('question')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  question_id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  content: string;

  // @Column({ type: 'varchar', length: 100, nullable: false })
  @Column({ type: 'enum', enum: QuestionType, nullable: false })
  question_type: string;

  @Column({ type: 'uuid', nullable: false })
  questionnaire_id: string;

  @OneToMany(() => Answer, (answer) => answer.question, { cascade: true })
  answers: Answer[];

  @ManyToOne(() => Questionnaire, (questionnaire) => questionnaire.questions, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'questionnaire_id' })
  questionnaire: Questionnaire;

  @OneToMany(() => EntityQuestionnaire, (entityQuestionnaire) => entityQuestionnaire.answer, { cascade: true })
  entity_questionnaire: EntityQuestionnaire[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
