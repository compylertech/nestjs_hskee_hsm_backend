import { AnswerDto, QuestionType } from "@app/contracts";

export class QuestionDto {
    question_id: string;
    content: string;
    question_type: QuestionType;
    questionnaire_id: string;
    answers?: AnswerDto[];
  }
  