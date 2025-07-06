import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {mergeMap, of} from 'rxjs';

import {catchError, map} from 'rxjs/operators';
import {ssmParameterListActions} from './ssm-parameter-list.actions';
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {SsmService} from "../../service/ssm-service.component";

@Injectable()
export class SsmParameterListEffects {

    sortColumns: SortColumn[] = [];

    loadParameters$ = createEffect(() => this.actions$.pipe(
        ofType(ssmParameterListActions.loadParameters),
        mergeMap(action =>
            this.ssmService.listParameterCounters(action.prefix, action.pageSize, action.pageIndex, action.sortColumns)
                .pipe(map((parameters: any) => ssmParameterListActions.loadParametersSuccess({parameters})),
                    catchError((error) =>
                        of(ssmParameterListActions.loadParametersFailure({error: error.message}))
                    )
                )
        ),
    ));

    createParameter$ = createEffect(() => this.actions$.pipe(
        ofType(ssmParameterListActions.createParameter),
        mergeMap(action =>
            this.ssmService.createParameter(action.request)
                .pipe(map((parameters: any) => ssmParameterListActions.createParameterSuccess({parameters})),
                    catchError((error) =>
                        of(ssmParameterListActions.createParameterFailure({error: error.message}))
                    )
                )
        ),
    ));

    updateParameter$ = createEffect(() => this.actions$.pipe(
        ofType(ssmParameterListActions.updateParameter),
        mergeMap(action =>
            this.ssmService.updateParameter(action.request)
                .pipe(map((parameters: any) => ssmParameterListActions.updateParameterSuccess({parameters})),
                    catchError((error) =>
                        of(ssmParameterListActions.updateParameterFailure({error: error.message}))
                    )
                )
        ),
    ));

    deleteParameter$ = createEffect(() => this.actions$.pipe(
        ofType(ssmParameterListActions.deleteParameter),
        mergeMap((action) =>
            this.ssmService.deleteParameter(action.name, action.prefix, action.pageSize, action.pageIndex, action.sortColumns)
                .pipe(map((parameters: any) => ssmParameterListActions.deleteParameterSuccess({parameters})),
                    catchError((error) =>
                        of(ssmParameterListActions.deleteParameterFailure({error: error.message}))
                    )
                )
        )
    ));

    constructor(private readonly actions$: Actions, private readonly ssmService: SsmService) {
    }
}
