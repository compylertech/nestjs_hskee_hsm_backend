import { QuestionnaireDto, UserBaseDto } from "@app/contracts";

  export class QuestionnaireResponse {
    user_id: string;
    questionnaires: QuestionnaireDto[];
    user: UserBaseDto | null;
  }
  
  interface PageMeta {
    page: number;
    limit: number;
    itemCount: number;
    pageCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  }
  
  interface PageDto<T> {
    success: boolean;
    error: string;
    data: T[];
    meta: PageMeta;
  }
  