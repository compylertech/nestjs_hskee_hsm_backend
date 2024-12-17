import { AnswerType } from "@app/contracts";

export class CreateAnswerDto {
  answer_type: AnswerType;
  content: string;
}
