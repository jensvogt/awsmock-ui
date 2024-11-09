import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, mergeMap, of} from 'rxjs';
import {lambdaFunctionListActions} from './lambda-function-list.actions';
import {map} from "rxjs/operators";
import {LambdaService} from "../../service/lambda-service.component";

@Injectable()
export class LambdaFunctionListEffects {

    loadFunctionCounters$ = createEffect(() => this.actions$.pipe(
        ofType(lambdaFunctionListActions.loadFunctions),
        mergeMap(action =>
            this.lambdaService.listFunctionCounters(
                action.prefix,
                action.pageSize,
                action.pageIndex,
                action.sortColumns)
                .pipe(map((functions: any) => lambdaFunctionListActions.loadFunctionsSuccess({functions})),
                    catchError((error) =>
                        of(lambdaFunctionListActions.loadFunctionsFailure({error: error.message}))
                    )
                )
        )
    ));

    deleteFunction$ = createEffect(() => this.actions$.pipe(
        ofType(lambdaFunctionListActions.deleteFunction),
        mergeMap(action =>
            this.lambdaService.deleteFunction(action.functionName)
                .then(() => lambdaFunctionListActions.deleteFunctionSuccess()))
    ));

    constructor(private actions$: Actions, private lambdaService: LambdaService) {
    }
}