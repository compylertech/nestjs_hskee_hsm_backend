import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

// entity
import { Question } from '../../questions/entities/questions.entity';

@Entity('questionnaire')
export class Questionnaire {
  @PrimaryGeneratedColumn('uuid')
  questionnaire_id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => Question, (question) => question.questionnaire, { cascade: true })
  questions: Question[];

  @Column({ type: 'boolean', default: false })
  publish_for_registration: boolean;

  @Column({ type: 'boolean', default: false })
  published: boolean;

  @Column({ type: 'int', default: 0 })
  number_of_responses: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
