import { AnswerType } from "@app/contracts";

export class AnswerDto {
  answer_id: string;
  answer_type: AnswerType;
  content: string;
}
