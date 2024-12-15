import { QuestionDto } from "@app/contracts";

export class QuestionnaireDto {
  questionnaire_id: string;
  title: string;
  description: string;
  questions: QuestionDto[];
  publish_for_registration: boolean;
  published: boolean;
  created_at: Date;
  updated_at: Date;
  number_of_responses: number;
}
