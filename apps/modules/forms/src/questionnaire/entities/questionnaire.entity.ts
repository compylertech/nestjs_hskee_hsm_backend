import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

// entity
import { Question } from '../../questions/entities/questions.entity';
import { EntityQuestionnaire } from './entity-questionnaire.entity';

@Entity('questionnaire')
export class Questionnaire {
  @PrimaryGeneratedColumn('uuid')
  questionnaire_id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: false })
  publish_for_registration: boolean;

  @Column({ type: 'varchar', length: 255, nullable: false })
  tag: string;

  @Column({ type: 'boolean', default: false })
  published: boolean;

  @Column({ type: 'int', default: 0 })
  number_of_responses: number;
  
  @OneToMany(() => Question, (question) => question.questionnaire, { cascade: true })
  questions: Question[];

  @OneToMany(() => EntityQuestionnaire, (entityQuestionnaire) => entityQuestionnaire.questionnaire, { cascade: true })
  entity_questionnaire: EntityQuestionnaire[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
