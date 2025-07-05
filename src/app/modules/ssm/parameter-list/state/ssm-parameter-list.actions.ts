import {createAction, props} from '@ngrx/store';
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {CreateParameterCounterRequest, ListParameterCountersResponse} from "../../model/ssm-parameter-item";

export const ssmParameterListActions = {
    initialize: createAction('[ssm-parameter-list] initialize'),

    // Load parameter
    loadParameters: createAction('[ssm-parameter-list] Load parameters', props<{ prefix: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[] }>()),
    loadParametersSuccess: createAction('[ssm-parameter-list] Load parameters success', props<{ parameters: ListParameterCountersResponse }>()),
    loadParametersFailure: createAction('[ssm-parameter-list] Load parameters error', props<{ error: string }>()),

    // Delete parameter
    deleteParameter: createAction('[ssm-parameter-list] Delete parameter', props<{ name: string, prefix: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[] }>()),
    deleteParameterSuccess: createAction('[ssm-parameter-list] Delete parameter success', props<{ parameters: ListParameterCountersResponse }>()),
    deleteParameterFailure: createAction('[ssm-parameter-list] Delete parameter error', props<{ error: string }>()),

    // Add parameter
    createParameter: createAction('[ssm-parameter-list] Create parameter', props<{ request: CreateParameterCounterRequest }>()),
    createParameterSuccess: createAction('[ssm-parameter-list] Create parameter success', props<{ parameters: ListParameterCountersResponse }>()),
    createParameterFailure: createAction('[ssm-parameter-list] Create parameter error', props<{ error: string }>()),
    
    //
    // // Send a message
    // sendMessage: createAction('[ssm-parameter-list] Send message', props<{ queueUrl: string, message: string, delay: number, attributes: any }>()),
    // sendMessageSuccess: createAction('[ssm-parameter-list] Send message success'),
    // sendMessageFailure: createAction('[ssm-parameter-list] Send message error', props<{ error: string }>()),
    //
    // // Purge queue
    // purgeQueue: createAction('[ssm-parameter-list] Purge Queue', props<{ queueUrl: string }>()),
    // purgeQueueSuccess: createAction('[ssm-parameter-list] Purge Queue Success'),
    // purgeQueueFailure: createAction('[ssm-parameter-list] Purge Queue Error', props<{ error: string }>()),
    //
}