import {createAction, props} from '@ngrx/store';

export const dashboardActions = {
    initialize: createAction('[dashboard] initialize'),
    loadCpuChart: createAction('[dashboard] loadCpuChart', props<{ name: string, start: Date, end: Date, step: number }>()),
    loadCpuChartSuccess: createAction('[dashboard] loadCpuChartSuccess', props<{ queues: number[][] }>()),
    loadCpuChartFailure: createAction('[dashboard] loadCpuChartFailure', props<{ error: string }>()),
}