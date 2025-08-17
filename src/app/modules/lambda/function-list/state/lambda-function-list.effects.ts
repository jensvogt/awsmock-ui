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

    resetCounters$ = createEffect(() => this.actions$.pipe(
        ofType(lambdaFunctionListActions.resetCounters),
        mergeMap(action =>
            this.lambdaService.resetCounters(action.functionName)
                .pipe(map(() => lambdaFunctionListActions.resetCountersSuccess()),
                    catchError((error) =>
                        of(lambdaFunctionListActions.resetCountersFailure({error: error.message}))
                    )
                )
        )));

    startAllLambdas$ = createEffect(() => this.actions$.pipe(
        ofType(lambdaFunctionListActions.startAllLambdas),
        mergeMap(action =>
            this.lambdaService.startAllLambdas()
                .pipe(map(() => lambdaFunctionListActions.startAllLambdasSuccess()),
                    catchError((error) =>
                        of(lambdaFunctionListActions.startAllLambdasFailure({error: error.message}))
                    )
                )
        )));

    stopAllLambdas$ = createEffect(() => this.actions$.pipe(
        ofType(lambdaFunctionListActions.stopAllLambdas),
        mergeMap(action =>
            this.lambdaService.stopAllLambdas()
                .pipe(map(() => lambdaFunctionListActions.stopAllLambdasSuccess()),
                    catchError((error) =>
                        of(lambdaFunctionListActions.stopAllLambdasFailure({error: error.message}))
                    )
                )
        )));

    deleteImage$ = createEffect(() => this.actions$.pipe(
        ofType(lambdaFunctionListActions.deleteImage),
        mergeMap(action =>
            this.lambdaService.deleteImage(action.functionArn)
                .pipe(map(() => lambdaFunctionListActions.deleteImageSuccess()),
                    catchError((error) =>
                        of(lambdaFunctionListActions.deleteImageFailure({error: error.message}))
                    )
                )
        )));

    deleteFunction$ = createEffect(() => this.actions$.pipe(
        ofType(lambdaFunctionListActions.deleteFunction),
        mergeMap(action =>
            this.lambdaService.deleteFunction(action.functionName)
                .pipe(map(() => lambdaFunctionListActions.deleteFunctionSuccess()),
                    catchError((error) =>
                        of(lambdaFunctionListActions.deleteFunctionFailure({error: error.message}))
                    )
                )
        )));

    constructor(private readonly actions$: Actions, private readonly lambdaService: LambdaService) {
    }
}