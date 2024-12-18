import { CreateAnswerDto, QuestionType, UpdateAnswerDto } from "@app/contracts";

export class CreateQuestionDto {
  content: string;
  question_type: QuestionType;
  questionnaire_id?: string;
  answers?: CreateAnswerDto[]|UpdateAnswerDto[];
}
