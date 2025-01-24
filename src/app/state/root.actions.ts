import {createAction, props} from '@ngrx/store';

export const rootActions = {

    setBackendServer: createAction('[Root] Set backend server', props<{ server: string }>()),
    setBackendServerSuccess: createAction('[Root] Set backend server'),
    setBackendServerFailure: createAction('[Root] Set backend server failure')
};
