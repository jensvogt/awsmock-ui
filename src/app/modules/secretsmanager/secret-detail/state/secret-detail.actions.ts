import {createAction, props} from '@ngrx/store';
import {LoadLambdaArnsResponse, RotateSecretRequest, SecretDetails} from "../../model/secret-detail-item";
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {SecretVersionCountersResponse} from "../../model/secret-version-item";

export const secretDetailsActions = {
    initialize: createAction('[secret-details] initialize'),

    // Load details
    loadDetails: createAction('[secret-details] Load secret details', props<{ secretId: string }>()),
    loadDetailsSuccess: createAction('[secret-details] Load secret details success', props<{ secretDetails: SecretDetails }>()),
    loadDetailsFailure: createAction('[secret-details] Load secret details error', props<{ error: string }>()),

    // Load versions
    loadVersions: createAction('[secret-details] Load secret versions', props<{ secretId: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[] }>()),
    loadVersionsSuccess: createAction('[secret-details] Load secret versions success', props<{ secretVersions: SecretVersionCountersResponse }>()),
    loadVersionsFailure: createAction('[secret-details] Load secret versions error', props<{ error: string }>()),

    // Update secret
    updateDetails: createAction('[secret-details] Update secret', props<{ secretDetails: SecretDetails }>()),
    updateDetailsSuccess: createAction('[secret-details] Update secret success', props<{ secretDetails: SecretDetails }>()),
    updateDetailsFailure: createAction('[secret-details] Update secret error', props<{ error: string }>()),

    // Rotate secret
    rotateSecret: createAction('[secret-details] Rotate secret', props<{ rotateSecretRequest: RotateSecretRequest }>()),
    rotateSecretSuccess: createAction('[secret-details] Rotate secret success', props<{ secretDetails: SecretDetails }>()),
    rotateSecretFailure: createAction('[secret-details] Rotate secret error', props<{ error: string }>()),

    // Load rotation lambdas
    loadLambdasARNs: createAction('[secret-details] Load lambda ARNs'),
    loadLambdasARNsSuccess: createAction('[secret-details] Load lambda ARNs success', props<{ loadLambdaArnsResponse: LoadLambdaArnsResponse }>()),
    loadLambdasARNsFailure: createAction('[secret-details] Load lambda ARNs error', props<{ error: string }>()),

    // Load tags
    //loadTags: createAction('[sns-topic-details] Load topics tags', props<{ secretArn: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[] }>()),
    //loadTagsSuccess: createAction('[sns-topic-details] Load topics tags success', props<{ tags: SqsTagCountersResponse }>()),
    //loadTagsFailure: createAction('[sns-topic-details] Load topics tags error', props<{ error: string }>()),
}