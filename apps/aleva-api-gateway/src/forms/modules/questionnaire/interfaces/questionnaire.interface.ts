import { QuestionnaireDto, UserBaseDto } from "@app/contracts";

export class QuestionnaireResponse {
    user_id: string;
    questionnaires: QuestionnaireDto[];
    user: UserBaseDto | null;
}