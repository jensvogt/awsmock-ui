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

    /*
        createParameter$ = createEffect(() => this.actions$.pipe(
            ofType(ssmParameterListActions.createParameter),
            mergeMap((action) =>
                this.sqsService.createParameter(action.name)
                    .pipe(map(() => ssmParameterListActions.createParameterSuccess),
                        catchError((error) =>
                            of(ssmParameterListActions.createParameterFailure({error: error.message}))
                        )
                    )
            )
        ));

        sendMessage$ = createEffect(() => this.actions$.pipe(
            ofType(ssmParameterListActions.sendMessage),
            mergeMap(action =>
                this.sqsService.sendMessage(action.parameterUrl, action.message, action.delay, action.attributes)
                    .pipe(map(() => ssmParameterListActions.sendMessageSuccess),
                        catchError((error) =>
                            of(ssmParameterListActions.sendMessageFailure({error: error.message}))
                        )
                    )
            )
        ));

        purgeParameter$ = createEffect(() => this.actions$.pipe(
            ofType(ssmParameterListActions.purgeParameter),
            mergeMap(action =>
                this.sqsService.purgeParameter(action.parameterUrl)
                    .pipe(map(() => ssmParameterListActions.purgeParameterSuccess()),
                        catchError((error) =>
                            of(ssmParameterListActions.purgeParameterFailure({error: error.message}))
                        )
                    )
            )
        ));

*/

    constructor(private readonly actions$: Actions, private readonly ssmService: SsmService) {
    }
}
