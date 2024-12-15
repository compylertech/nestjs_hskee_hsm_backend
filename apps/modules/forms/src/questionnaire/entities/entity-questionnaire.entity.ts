import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    Check,
    JoinColumn,
  } from 'typeorm';
  import { Questionnaire } from './questionnaire.entity';
  import { Question } from '../../questions/entities/questions.entity';
  import { Answer } from '../../answers/entities/answer.entity';
  
  export enum EntityTypeEnum {
    USER = 'user',
    QUESTIONS = 'questions',
    QUESTIONNAIRES = 'questionnaires',
    ANSWERS = 'answers',
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
  }
  