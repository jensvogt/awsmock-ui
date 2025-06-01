import {createAction, props} from '@ngrx/store';
import {SecretDetails} from "../../model/secret-detail-item";
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {SecretVersionCountersResponse} from "../../model/secret-version-item";

export const secretDetailsActions = {
    initialize: createAction('[sqs-secret-details] initialize'),

    // Load details
    loadDetails: createAction('[sqs-secret-details] Load secret details', props<{ secretId: string }>()),
    loadDetailsSuccess: createAction('[sqs-secret-details] Load secret details success', props<{ secretDetails: SecretDetails }>()),
    loadDetailsFailure: createAction('[sqs-secret-details] Load secret details error', props<{ error: string }>()),

    // Load versions
    loadVersions: createAction('[sqs-secret-details] Load secret versions', props<{ secretId: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[] }>()),
    loadVersionsSuccess: createAction('[sqs-secret-details] Load secret versions success', props<{ secretVersions: SecretVersionCountersResponse }>()),
    loadVersionsFailure: createAction('[sqs-secret-details] Load secret versions error', props<{ error: string }>()),

    // Load tags
    //loadTags: createAction('[sns-topic-details] Load topics tags', props<{ secretArn: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[] }>()),
    //loadTagsSuccess: createAction('[sns-topic-details] Load topics tags success', props<{ tags: SqsTagCountersResponse }>()),
    //loadTagsFailure: createAction('[sns-topic-details] Load topics tags error', props<{ error: string }>()),
}