import { CreateQuestionDto, UpdateQuestionDto } from "@app/contracts";

export class CreateQuestionnaireDto {
  title: string;
  description?: string;
  questions?: CreateQuestionDto[]|UpdateQuestionDto[];
  publish_for_registration?: boolean;
  published?: boolean;
}
