import {createAction, props} from '@ngrx/store';
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {ListSecretCountersResponse} from "../../model/sqs-queue-item";

export const secretListActions = {
    initialize: createAction('[secret-list] initialize'),

    // Load secret
    loadSecrets: createAction('[secret-list] Load secrets', props<{ prefix: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[] }>()),
    loadSecretsSuccess: createAction('[secret-list] Load secrets success', props<{ secrets: ListSecretCountersResponse }>()),
    loadSecretsFailure: createAction('[secret-list] Load secrets error', props<{ error: string }>()),

    // Add secret
    createSecret: createAction('[secret-list] Create secret', props<{ secretName: string }>()),
    createSecretSuccess: createAction('[secret-list] Create secret success'),
    createSecretFailure: createAction('[secret-list] Create secret error', props<{ error: string }>()),

    // Delete secret
    deleteSecret: createAction('[secret-list] Delete secret', props<{ secretArn: string }>()),
    deleteSecretSuccess: createAction('[secret-list] Delete secret success'),
    deleteSecretFailure: createAction('[secret-list] Delete secret error', props<{ error: string }>())
}