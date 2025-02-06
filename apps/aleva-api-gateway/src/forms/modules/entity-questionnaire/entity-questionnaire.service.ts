import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

// constants
import { FORMS_CLIENT } from '../../../common/utils/constants';

// contracts
import {
    EntityQuestionnaireTypeEnum,
    ENTITY_QUESTIONNAIRE_PATTERN,
    EntityQuestionnaireDto as ClientEntityQuestionnaireDto,
    CreateEntityQuestionnaireDto as ClientCreateEntityQuestionnaireDto,
    UpdateEntityQuestionnaireDto as ClientUpdateEntityQuestionnaireDto,

    EntityMediaDto as ClientEntityMediaDto,
    CreateEntityMediaDto as ClientCreateEntityMediaDto,
} from '@app/contracts';

// dto
import { CreateEntityQuestionnaireDto } from './dto/create-entity-questionnaire.dto';
import { UpdateEntityQuestionnaireDto } from './dto/update-entity-questionnaire.dto';

// service
import { CrudService } from 'apps/aleva-api-gateway/src/common/service/crud-impl.service';
import { BaseService } from 'apps/aleva-api-gateway/src/common/service/base-impl-crud.service';


@Injectable()
export class EntityQuestionnaireService extends BaseService<
    EntityQuestionnaireTypeEnum,
    CreateEntityQuestionnaireDto,
    UpdateEntityQuestionnaireDto,
    ClientEntityQuestionnaireDto,
    ClientCreateEntityQuestionnaireDto,
    ClientUpdateEntityQuestionnaireDto,
    ClientEntityMediaDto,
    ClientCreateEntityMediaDto
> {
    constructor(@Inject(FORMS_CLIENT) private readonly entityQuestionnaireClient: ClientProxy) { 
        super(
            'entity_questionnaire_id',
            entityQuestionnaireClient,
            new CrudService(
                'entity_questionnaire_id',
                entityQuestionnaireClient,
                {
                    FIND_ALL: '',
                    FIND_ONE: '',
                    CREATE: '',
                    UPDATE: '',
                    DELETE: '',
                    FIND_BY_ENTITIES: 'entityQuestionnaire.responses',
                    LINK_ENTITY: ENTITY_QUESTIONNAIRE_PATTERN.CREATE,
                    DELETE_BY_ENTITY: ENTITY_QUESTIONNAIRE_PATTERN.DELETE_BY_ENTITY
                },
                ClientCreateEntityMediaDto,
                []
            )
        );
    }
}

