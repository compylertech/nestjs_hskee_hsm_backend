export class CreateEntityQuestionnaireDto {
  entity_id: string;
  entity_type: string;
  questionnaire_id: string;
  question_id: string;
  answer_id: string;
  answer_type?: string;
  content?: string;
  mark_as_read?: boolean;
}
